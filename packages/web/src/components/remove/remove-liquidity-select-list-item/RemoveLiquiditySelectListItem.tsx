import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useMemo } from "react";
import { RemoveLiquiditySelectListItemWrapper, TooltipWrapperContent } from "./RemoveLiquiditySelectListItem.styles";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
// import { convertToMB } from "@utils/stake-position-utils";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { tooltipWrapper } from "@components/stake/select-lilquidity-list-item/SelectLiquidityListItem.styles";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { numberToUSD } from "@utils/number-utils";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { useWindowSize } from "@hooks/common/use-window-size";
import { convertToKMB } from "@utils/stake-position-utils";
import BigNumber from "bignumber.js";

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
          <div className="value">{BigNumber(makeDisplayTokenAmount(position.pool.tokenA, position.token0Balance) || 0).toFormat(2)}</div>
        </div>
        <div>
          <div className="value">
            <img src={position.pool.tokenB.logoURI} alt="token logo" />
            {position.pool.tokenB.symbol}
          </div>
          <div className="value">{BigNumber(makeDisplayTokenAmount(position.pool.tokenB, position.token1Balance) || 0).toFormat(2)}</div>
        </div>
      </div>
      {disabled && <div className="divider"></div>}
      {disabled && (
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
        <Tooltip
          placement="top"
          FloatingContent={<TooltipContent position={position} disabled={disabled} />}
        >
          <div className="logo-wrapper">
            <DoubleLogo left={tokenA.logoURI} right={tokenB.logoURI} size={24} leftSymbol={tokenA.symbol} rightSymbol={tokenB.symbol}/>
            {width > 768 && <span className="token-id">{`${tokenA.symbol}/${tokenB.symbol}`}</span>}
            <Badge text={feeStr} type={BADGE_TYPE.DARK_DEFAULT} />
          </div>
        </Tooltip>
      </div>
      {/* <span className="liquidity-value-fake" ref={liquidityRef}>${lpPosition.position.balance.toLocaleString()}</span>
      <span className="liquidity-value" >${!checkWidth ? convertToMB(lpPosition.position.balance.toString()) : lpPosition.position.balance.toLocaleString()}</span> */}
      <span className="liquidity-value" >{liquidityUSD}</span>
    </RemoveLiquiditySelectListItemWrapper>
  );
};

export default RemoveLiquiditySelectListItem;
