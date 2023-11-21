import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { RemoveLiquiditySelectListItemWrapper, TooltipWrapperContent } from "./RemoveLiquiditySelectListItem.styles";
import { LPPositionModel } from "@models/position/lp-position-model";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import { convertLiquidity } from "@utils/stake-position-utils";

interface RemoveLiquiditySelectListItemProps {
  selected: boolean;
  lpPosition: LPPositionModel;
  select: (id: string) => void;
  width: number;
}

interface TooltipProps {
  selectable: boolean;
}

const TooltipContent:React.FC<TooltipProps> = ({ selectable }) => {
  return (
    <TooltipWrapperContent>
      <div>
        <div className="title">Token ID</div>
        <div className="title">#982932</div>
      </div>
      <div>
        <div className="value">
          <img src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png" />
          GNS
        </div>
        <div className="value">50.05881</div>
      </div>
      <div>
        <div className="value">
          <img src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png" />
          GNS
        </div>
        <div className="value">50.05881</div>
      </div>
      {selectable && <div className="divider"></div>}
      {selectable && <div className="unstake-description">
        *You need to unstake your position first.
      </div>}
    </TooltipWrapperContent>
  );
};

const RemoveLiquiditySelectListItem: React.FC<RemoveLiquiditySelectListItemProps> = ({
  selected,
  lpPosition,
  select,
  width,
}) => {
  const [checkWidth, setIsCheckWidth] = useState(true);
  const leftDivRef = useRef<HTMLDivElement>(null);
  const liquidityRef = useRef<HTMLDivElement>(null);

  const selectable = useMemo(() => {
    return lpPosition.position.balance > 0;
  }, [lpPosition]);

  const doubleLogo = useMemo(() => {
    const { tokenA, tokenB } = lpPosition.position.pool;
    return {
      left: tokenA.logoURI,
      right: tokenB.logoURI,
    };
  }, [lpPosition]);

  const onChangeCheckbox = useCallback(() => {
    select(lpPosition.lpRewardId);
  }, [lpPosition.lpRewardId, select]);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWidth = Math.min(width, 500);
      const totalWidth = (leftDivRef?.current?.offsetWidth || 0) + (liquidityRef?.current?.offsetWidth || 0) + 100;
      setIsCheckWidth(windowWidth > totalWidth);
    }
  }, [liquidityRef.current, leftDivRef.current, width]);

  return (
    <RemoveLiquiditySelectListItemWrapper selected={selected}>
      <div className="left-content" ref={leftDivRef}>
        <input
          id={`checkbox-item-${lpPosition.lpRewardId}`}
          type="checkbox"
          disabled={!selectable}
          checked={selected}
          onChange={onChangeCheckbox}
        />
        <label htmlFor={`checkbox-item-${lpPosition.lpRewardId}`} />
        <DoubleLogo {...doubleLogo} size={24} />
        <Tooltip
          placement="top"
          FloatingContent={<TooltipContent selectable={!selectable}/>}
        >
          <span className="token-id">GNS/GNOT</span>
        </Tooltip>
        <Badge text="0.3%" type={BADGE_TYPE.DARK_DEFAULT}/>
      </div>
      <span className="liquidity-value-fake" ref={liquidityRef}>${lpPosition.position.balance.toLocaleString()}</span>
      <span className="liquidity-value" >${!checkWidth ? convertLiquidity(lpPosition.position.balance.toString()) : lpPosition.position.balance.toLocaleString()}</span>
    </RemoveLiquiditySelectListItemWrapper>
  );
};

export default RemoveLiquiditySelectListItem;
