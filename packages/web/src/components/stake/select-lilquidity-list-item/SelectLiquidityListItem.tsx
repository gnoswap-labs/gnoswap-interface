import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { numberToUSD } from "@utils/number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import React, { useMemo } from "react";
import { tooltipWrapper, wrapper } from "./SelectLiquidityListItem.styles";

interface SelectLiquidityListItemProps {
  disabled?: boolean;
  position: PoolPositionModel;
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
}

const TooltipContent: React.FC<{ position: PoolPositionModel, disabled: boolean }> = ({ position, disabled }) => {
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
        <div className="value">{makeDisplayTokenAmount(position.pool.tokenA, position.token0Balance)}</div>
      </div>
      <div>
        <div className="value">
          <img src={position.pool.tokenB.logoURI} />
          {position.pool.tokenB.symbol}
        </div>
        <div className="value">{makeDisplayTokenAmount(position.pool.tokenB, position.token1Balance)}</div>
      </div>
      {disabled && <div className="divider"></div>}
      {disabled && (
          <div className="unstake-description">
            *You need to unstake your position first.
          </div>
        )}
    </div>
  );
};

const SelectLiquidityListItem: React.FC<SelectLiquidityListItemProps> = ({
  position,
  checkedList,
  onCheckedItem,
  disabled = false,
}) => {
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
    return numberToUSD(Number(position.positionUsdValue));
  }, [position.positionUsdValue]);

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
        <DoubleLogo left={tokenA.logoURI} right={tokenB.logoURI} size={24} leftSymbol={tokenA.symbol} rightSymbol={tokenB.symbol}/>
        <Tooltip
          placement="top"
          FloatingContent={<TooltipContent position={position} disabled={disabled}/>}
        >
          <span className="token-id">{`${position.pool.tokenA.symbol}/${position.pool.tokenB.symbol}`}</span>
        </Tooltip>
        <Badge text={`${Number(position.pool.fee) / 10000}%`} type={BADGE_TYPE.DARK_DEFAULT} />
      </div>
      <span className="liquidity-value" >{liquidityUSD}</span>
    </li>
  );
};

export default SelectLiquidityListItem;
