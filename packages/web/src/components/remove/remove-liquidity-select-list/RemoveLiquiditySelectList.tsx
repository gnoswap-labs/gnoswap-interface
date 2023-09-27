import React, { useCallback } from "react";
import { RemoveLiquiditySelectListWrapper } from "./RemoveLiquiditySelectList.styles";
import { LPPositionModel } from "@models/position/lp-position-model";
import RemoveLiquiditySelectListItem from "../remove-liquidity-select-list-item/RemoveLiquiditySelectListItem";

interface RemoveLiquiditySelectListProps {
  selectedAll: boolean;
  lpPositions: LPPositionModel[];
  selectedIds: string[];
  select: (id: string) => void;
  selectAll: () => void;
}

const RemoveLiquiditySelectList: React.FC<RemoveLiquiditySelectListProps> = ({
  selectedAll,
  lpPositions,
  selectedIds,
  select,
  selectAll,
}) => {

  const isSelectLiquidity = useCallback((lpPosition: LPPositionModel) => {
    return selectedIds.findIndex(id => id === lpPosition.lpRewardId) > -1;
  }, [selectedIds]);

  return (
    <RemoveLiquiditySelectListWrapper>
      <div className="checked-all-wrap">
        <input
          id="checkbox-all"
          type="checkbox"
          checked={selectedAll}
          onChange={selectAll}
        />
        <label htmlFor="checkbox-all"> Select All</label>
        <span>Liquidity</span>
      </div>
      <ul>
        {lpPositions.map((lpPosition, index) => (
          <RemoveLiquiditySelectListItem
            key={index}
            lpPosition={lpPosition}
            selected={isSelectLiquidity(lpPosition)}
            select={select}
          />
        ))}
      </ul>
    </RemoveLiquiditySelectListWrapper>
  );
};

export default RemoveLiquiditySelectList;
