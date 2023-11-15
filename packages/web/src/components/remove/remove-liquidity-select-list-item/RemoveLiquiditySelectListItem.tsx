import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useCallback, useMemo } from "react";
import { RemoveLiquiditySelectListItemWrapper } from "./RemoveLiquiditySelectListItem.styles";
import { LPPositionModel } from "@models/position/lp-position-model";

interface RemoveLiquiditySelectListItemProps {
  selected: boolean;
  lpPosition: LPPositionModel;
  select: (id: string) => void;
}

const RemoveLiquiditySelectListItem: React.FC<RemoveLiquiditySelectListItemProps> = ({
  selected,
  lpPosition,
  select,
}) => {

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

  return (
    <RemoveLiquiditySelectListItemWrapper selected={selected}>
      <input
        id={`checkbox-item-${lpPosition.lpRewardId}`}
        type="checkbox"
        disabled={!selectable}
        checked={selected}
        onChange={onChangeCheckbox}
      />
      <label htmlFor={`checkbox-item-${lpPosition.lpRewardId}`} />
      <DoubleLogo {...doubleLogo} size={24} />
      <span className="token-id">ID {lpPosition.lpRewardId}</span>
      {!selectable && (
        <div className="hover-info">
          <Tooltip
            placement="top"
            FloatingContent={
              <div>You need to unstake your position first.</div>
            }
          >
            <IconInfo className="icon-info" />
          </Tooltip>
        </div>
      )}
      <span className="liquidity-value">${lpPosition.position.balance.toLocaleString()}</span>
    </RemoveLiquiditySelectListItemWrapper>
  );
};

export default RemoveLiquiditySelectListItem;
