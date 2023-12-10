import React, { useCallback } from "react";
import { RemoveLiquiditySelectListWrapper } from "./RemoveLiquiditySelectList.styles";
import RemoveLiquiditySelectListItem from "../remove-liquidity-select-list-item/RemoveLiquiditySelectListItem";
import { PoolPositionModel } from "@models/position/pool-position-model";

interface RemoveLiquiditySelectListProps {
  selectedAll: boolean;
  positions: PoolPositionModel[];
  selectedIds: string[];
  select: (id: string) => void;
  selectAll: () => void;
  width: number;
}

const RemoveLiquiditySelectList: React.FC<RemoveLiquiditySelectListProps> = ({
  selectedAll,
  positions,
  selectedIds,
  select,
  selectAll,
  width,
}) => {

  const isSelectLiquidity = useCallback((position: PoolPositionModel) => {
    return selectedIds.findIndex(id => id === position.id) > -1;
  }, [selectedIds]);

  return (
    <RemoveLiquiditySelectListWrapper>
      <div className="checked-all-wrap">
        <div className="wrapper-check-label">
          <input
            id="checkbox-all"
            type="checkbox"
            checked={selectedAll}
            onChange={selectAll}
          />
          <label htmlFor="checkbox-all" />
          <span className="custom-label">Select All</span>
        </div>
        <span>Liquidity</span>
      </div>
      <ul>
        {positions.map((position, index) => (
          <RemoveLiquiditySelectListItem
            key={index}
            position={position}
            selected={isSelectLiquidity(position)}
            select={select}
            width={width}
          />
        ))}
      </ul>
    </RemoveLiquiditySelectListWrapper>
  );
};

export default RemoveLiquiditySelectList;
