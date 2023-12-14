import React from "react";
import SelectLiquidityListItem from "@components/stake/select-lilquidity-list-item/SelectLiquidityListItem";
import { wrapper } from "./SelectLiquidityList.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";

interface SelectLiquidityProps {
  stakedPositions: PoolPositionModel[];
  unstakedPositions: PoolPositionModel[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
}

const SelectLiquidityList: React.FC<SelectLiquidityProps> = ({
  stakedPositions,
  unstakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
}) => {
  return (
    <div css={wrapper}>
      <div className="checked-all-wrap">
        <div className="wrapper-check-label">
          <input
            id="checkbox-all"
            type="checkbox"
            checked={checkedAll}
            onChange={e => onCheckedAll(e.target.checked)}
          />
          <label htmlFor="checkbox-all" className="select-all-label" />
          <span className="custom-label">Select All</span>
        </div>
        <span>Liquidity</span>
      </div>
      <ul>
        {unstakedPositions.map((position, index) => (
          <SelectLiquidityListItem
            position={position}
            checkedList={checkedList}
            onCheckedItem={onCheckedItem}
            key={index}
          />
        ))}
        {stakedPositions.map((position, index) => (
          <SelectLiquidityListItem
            position={position}
            checkedList={checkedList}
            onCheckedItem={() => null}
            key={index}
            disabled
          />
        ))}
      </ul>
    </div>
  );
};

export default SelectLiquidityList;
