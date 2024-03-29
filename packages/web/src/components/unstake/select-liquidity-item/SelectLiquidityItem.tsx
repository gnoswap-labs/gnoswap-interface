import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { numberToUSD } from "@utils/number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import React, { useMemo } from "react";
import { tooltipWrapper, wrapper } from "./SelectLiquidityItem.styles";
import { useWindowSize } from "@hooks/common/use-window-size";
import { convertToKMB } from "@utils/stake-position-utils";
import BigNumber from "bignumber.js";

interface SelectLiquidityItemProps {
  position: PoolPositionModel;
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  disabled?: boolean;
}

const TooltipContent: React.FC<{ position: PoolPositionModel }> = ({ position }) => {
  return (
    <div css={tooltipWrapper()}>
      <div>
        <div className="title">Token ID</div>
        <div className="title">#{position.id}</div>
      </div>
      <div>
        <div className="value">
          <img src={position.pool.tokenA.logoURI} />
          {position.pool.tokenA.symbol}
        </div>
        <div className="value">{BigNumber(makeDisplayTokenAmount(position.pool.tokenA, position.token0Balance) || 0).toFormat(2)}</div>
      </div>
      <div>
        <div className="value">
          <img src={position.pool.tokenB.logoURI} />
          {position.pool.tokenB.symbol}
        </div>
        <div className="value">{BigNumber(makeDisplayTokenAmount(position.pool.tokenB, position.token1Balance) || 0).toFormat(2)}</div>
      </div>
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
    if (width < 400) return `$${convertToKMB(position.positionUsdValue)}`;
    return numberToUSD(Number(position.positionUsdValue));
  }, [position.positionUsdValue, width]);

  return (
    <li css={wrapper(checked)}>
      <div className="left-content" >
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
            <DoubleLogo left={tokenA.logoURI} right={tokenB.logoURI} size={24} leftSymbol={tokenA.symbol} rightSymbol={tokenB.symbol}/>
            {width > 768 && <span className="token-id">{`${tokenA.symbol}/${tokenB.symbol}`}</span>}
            <Badge text={`${Number(position.pool.fee) / 10000}%`} type={BADGE_TYPE.DARK_DEFAULT} />
          </div>
        </Tooltip>
      </div>
      <span className="liquidity-value" >{liquidityUSD}</span>
    </li>
  );
};

export default SelectLiquidityItem;
