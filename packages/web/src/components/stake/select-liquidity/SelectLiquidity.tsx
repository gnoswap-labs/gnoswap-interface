import React from "react";
import { wrapper } from "./SelectLiquidity.styles";
import SelectLiquidityList from "@components/stake/select-liquidity-list/SelectLiquidityList";
import { PoolPositionModel } from "@models/position/pool-position-model";

interface SelectLiquidityProps {
  // stakedPositions: PoolPositionModel[];
  unstakedPositions: PoolPositionModel[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  isHiddenTitle?: boolean;
  isEmpty: boolean;
  isLoading: boolean;
}

const SelectLiquidity: React.FC<SelectLiquidityProps> = ({
  // stakedPositions,
  unstakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  isHiddenTitle = false,
  isEmpty,
  isLoading,
}) => {
  return (
    <section css={wrapper}>
      {!isHiddenTitle && <h5 className="section-title">2. Select Liquidity</h5>}
      <SelectLiquidityList
        // stakedPositions={stakedPositions}
        unstakedPositions={unstakedPositions}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
        isEmpty={isEmpty}
        isLoading={isLoading}
      />
    </section>
  );
};

export default SelectLiquidity;
