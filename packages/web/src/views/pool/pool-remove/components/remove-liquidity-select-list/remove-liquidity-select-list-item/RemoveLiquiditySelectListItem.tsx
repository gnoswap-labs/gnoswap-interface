/* eslint-disable @next/next/no-img-element */
import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { formatOtherPrice } from "@utils/new-number-utils";
import { makeSwapFeeTier } from "@utils/swap-utils";

import {
  RemoveLiquiditySelectListItemWrapper,
  TokenTitleWrapper,
  TokenValueWrapper,
  TooltipWrapperContent,
} from "./RemoveLiquiditySelectListItem.styles";

interface RemoveLiquiditySelectListItemProps {
  position: PoolPositionModel;
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  disabled?: boolean;
}

interface TooltipProps {
  position: PoolPositionModel;
  disabled: boolean;
}

const TooltipContent: React.FC<TooltipProps> = ({ position, disabled }) => {
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
    <TooltipWrapperContent>
      <TokenTitleWrapper>
        <div className="title">
          {t("RemovePosition:positionList.item.tooltip.tokenID")}
        </div>
        <div className="title">#{position.id}</div>
      </TokenTitleWrapper>
      {renderTokenValue(position.pool.tokenA, position.tokenABalance)}
      {renderTokenValue(position.pool.tokenB, position.tokenBBalance)}
      {disabled && <div className="divider"></div>}
      {disabled && (
        <div className="unstake-description">
          {t("RemovePosition:positionList.item.disabled")}
        </div>
      )}
    </TooltipWrapperContent>
  );
};

const RemoveLiquiditySelectListItem: React.FC<
  RemoveLiquiditySelectListItemProps
> = ({ position, checkedList, onCheckedItem, disabled = false }) => {
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

  const feeStr = useMemo(() => {
    return SwapFeeTierInfoMap[makeSwapFeeTier(position.pool.fee)].rateStr;
  }, [position]);

  return (
    <RemoveLiquiditySelectListItemWrapper selected={checked}>
      <div className="left-content">
        <input
          id={`checkbox-item-${position.id}`}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={e => onCheckedItem(e.target.checked, position.id)}
        />
        <label htmlFor={`checkbox-item-${position.id}`} />
        <Tooltip
          placement="top"
          FloatingContent={
            <TooltipContent position={position} disabled={disabled} />
          }
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
            <Badge text={feeStr} type={BADGE_TYPE.DARK_DEFAULT} />
          </div>
        </Tooltip>
      </div>
      <span className="liquidity-value">{liquidityUSD}</span>
    </RemoveLiquiditySelectListItemWrapper>
  );
};

export default RemoveLiquiditySelectListItem;
