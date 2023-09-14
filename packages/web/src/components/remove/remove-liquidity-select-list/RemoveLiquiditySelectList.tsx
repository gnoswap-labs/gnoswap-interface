import React, { useCallback } from "react";
import RemoveLiquiditySelectListItem from "@components/remove/remove-liquidity-select-list-item/RemoveLiquiditySelectListItem";
import { RemoveLiquiditySelectListWrapper } from "./RemoveLiquiditySelectList.styles";
import { LiquidityInfoModel } from "@models/liquidity/liquidity-info-model";

interface RemoveLiquiditySelectListProps {
  selectedAll: boolean;
  liquidities: LiquidityInfoModel[];
  selectedIds: string[];
  select: (id: string) => void;
  selectAll: () => void;
}

const RemoveLiquiditySelectList: React.FC<RemoveLiquiditySelectListProps> = ({
  selectedAll,
  liquidities,
  selectedIds,
  select,
  selectAll,
}) => {

  const isSelectLiquidity = useCallback((liquidity: LiquidityInfoModel) => {
    return selectedIds.findIndex(id => id === liquidity.liquidityId) > -1;
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
        {liquidities.map((liquidity, index) => (
          <RemoveLiquiditySelectListItem
            key={index}
            liquidity={liquidity}
            selected={isSelectLiquidity(liquidity)}
            select={select}
          />
        ))}
      </ul>
    </RemoveLiquiditySelectListWrapper>
  );
};

export default RemoveLiquiditySelectList;
