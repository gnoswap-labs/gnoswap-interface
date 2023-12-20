import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useMemo } from "react";
import { RemoveLiquiditySelectListItemWrapper, TooltipWrapperContent } from "./RemoveLiquiditySelectListItem.styles";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
// import { convertLargePrice } from "@utils/stake-position-utils";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { tooltipWrapper } from "@components/stake/select-lilquidity-list-item/SelectLiquidityListItem.styles";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { numberToUSD } from "@utils/number-utils";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { makeSwapFeeTier } from "@utils/swap-utils";

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
  return (
    <TooltipWrapperContent>
      <div css={tooltipWrapper()}>
        <div>
          <div className="title">Token ID</div>
          <div className="title">#{position.id}</div>
        </div>
        <div>
          <div className="value">
            <img src={position.pool.tokenA.logoURI} alt="token logo" />
            {position.pool.tokenA.symbol}
          </div>
          <div className="value">{makeDisplayTokenAmount(position.pool.tokenA, position.token0Balance)}</div>
        </div>
        <div>
          <div className="value">
            <img src={position.pool.tokenB.logoURI} alt="token logo" />
            {position.pool.tokenB.symbol}
          </div>
          <div className="value">{makeDisplayTokenAmount(position.pool.tokenB, position.token1Balance)}</div>
        </div>
      </div>
      {!disabled && <div className="divider"></div>}
      {!disabled && (
        <div className="unstake-description">
          *You need to unstake your position first.
        </div>
      )}
    </TooltipWrapperContent>
  );
};

const RemoveLiquiditySelectListItem: React.FC<RemoveLiquiditySelectListItemProps> = ({
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

  const feeStr = useMemo(() => {
    return SwapFeeTierInfoMap[makeSwapFeeTier(position.pool.fee)].rateStr;
  }, [position]);

  return (
    <RemoveLiquiditySelectListItemWrapper selected={checked}>
      <div className="left-content" >
        <input
          id={`checkbox-item-${position.id}`}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={e => onCheckedItem(e.target.checked, position.id)}
        />
        <label htmlFor={`checkbox-item-${position.id}`} />
        <DoubleLogo left={tokenA.logoURI} right={tokenB.logoURI} size={24} leftSymbol={tokenA.symbol} rightSymbol={tokenB.symbol}/>
        <Tooltip
          placement="top"
          FloatingContent={<TooltipContent position={position} disabled={disabled} />}
        >
          <span className="token-id">{`${tokenA.symbol}/${tokenB.symbol}`}</span>
        </Tooltip>
        <Badge text={feeStr} type={BADGE_TYPE.DARK_DEFAULT} />
      </div>
      {/* <span className="liquidity-value-fake" ref={liquidityRef}>${lpPosition.position.balance.toLocaleString()}</span>
      <span className="liquidity-value" >${!checkWidth ? convertLargePrice(lpPosition.position.balance.toString()) : lpPosition.position.balance.toLocaleString()}</span> */}
      <span className="liquidity-value" >{liquidityUSD}</span>
    </RemoveLiquiditySelectListItemWrapper>
  );
};

export default RemoveLiquiditySelectListItem;
