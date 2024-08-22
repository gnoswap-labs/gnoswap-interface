import React from "react";

import { PoolPositionModel } from "@models/position/pool-position-model";

import SelectLiquidityList from "./select-liquidity-list/SelectLiquidityList";

import { wrapper } from "./SelectLiquidity.styles";

interface SelectLiquidityProps {
  unstakedPositions: PoolPositionModel[];
  checkedList: number[];
  onCheckedItem: (checked: boolean, path: number) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  isHiddenTitle?: boolean;
  isEmpty: boolean;
  isLoading: boolean;
}

const SelectLiquidity: React.FC<SelectLiquidityProps> = ({
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
