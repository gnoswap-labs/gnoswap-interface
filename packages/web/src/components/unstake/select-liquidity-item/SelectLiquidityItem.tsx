import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { PoolPositionModel } from "@models/position/pool-position-model";
import React, { useMemo } from "react";
import {
  TokenTitleWrapper,
  TokenValueWrapper,
  tooltipWrapper,
  wrapper,
} from "./SelectLiquidityItem.styles";
import { useWindowSize } from "@hooks/common/use-window-size";
import BigNumber from "bignumber.js";
import { TokenModel } from "@models/token/token-model";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { formatOtherPrice } from "@utils/new-number-utils";
import { useTranslation } from "react-i18next";
import { isInRangePosition } from "@utils/stake-position-utils";
import RangeBadge from "@components/common/range-badge/RangeBadge";

interface SelectLiquidityItemProps {
  position: PoolPositionModel;
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  disabled?: boolean;
}

const TooltipContent: React.FC<{ position: PoolPositionModel }> = ({
  position,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();

  const renderTokenValue = (token: TokenModel, tokenBalance: string) => {
    const tokenBalanceByTokenDecimal = BigNumber(tokenBalance || 0).toFormat();

    return (
      <TokenValueWrapper>
        <div className="value">
          <MissingLogo
            url={getGnotPath(token).logoURI}
            symbol={getGnotPath(token).symbol}
            width={20}
          />
          {token.symbol}
        </div>
        <div className="value">{tokenBalanceByTokenDecimal}</div>
      </TokenValueWrapper>
    );
  };

  return (
    <div css={tooltipWrapper()}>
      <TokenTitleWrapper>
        <div className="title">
          {t("UnstakePosition:positionList.item.tooltip.tokenID")}
        </div>
        <div className="title">#{position.id}</div>
      </TokenTitleWrapper>
      {renderTokenValue(position.pool.tokenA, position.tokenABalance)}
      {renderTokenValue(position.pool.tokenB, position.tokenBBalance)}
    </div>
  );
};

const SelectLiquidityItem: React.FC<SelectLiquidityItemProps> = ({
  position,
  checkedList,
  onCheckedItem,
  disabled = false,
}) => {
  const { width } = useWindowSize();

  const checked = useMemo(() => {
    return checkedList.includes(position.id);
  }, [checkedList, position.id]);

  const tokenA = useMemo(() => {
    return position.pool.tokenA;
  }, [position.pool.tokenA]);

  const tokenB = useMemo(() => {
    return position.pool.tokenB;
  }, [position.pool.tokenB]);

  const liquidityUSD = useMemo(() => {
    return formatOtherPrice(position.positionUsdValue, {
      isKMB: width < 400,
    });
  }, [position.positionUsdValue, width]);

  const inRange = useMemo(() => isInRangePosition(position), [position]);

  return (
    <li css={wrapper(checked)}>
      <div className="left-content">
        <input
          id={`checkbox-item-${position.id}`}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={e => onCheckedItem(e.target.checked, position.id)}
        />
        <label htmlFor={`checkbox-item-${position.id}`} />
        <Tooltip
          placement="top"
          FloatingContent={<TooltipContent position={position} />}
        >
          <div className="logo-wrapper">
            <DoubleLogo
              left={tokenA.logoURI}
              right={tokenB.logoURI}
              size={24}
              leftSymbol={tokenA.symbol}
              rightSymbol={tokenB.symbol}
            />
            {width > 768 && (
              <span className="token-id">{`${tokenA.symbol}/${tokenB.symbol}`}</span>
            )}
            <Badge
              text={`${Number(position.pool.fee) / 10000}%`}
              type={BADGE_TYPE.DARK_DEFAULT}
            />
            <RangeBadge status={inRange ? "IN" : "OUT"} />
          </div>
        </Tooltip>
      </div>
      <span className="liquidity-value">{liquidityUSD}</span>
    </li>
  );
};

export default SelectLiquidityItem;
