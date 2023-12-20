import React from "react";
import SelectLiquidityItem from "@components/unstake/select-liquidity-item/SelectLiquidityItem";
import { wrapper } from "./SelectLiquidity.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";

interface SelectLiquidityProps {
  stakedPositions: PoolPositionModel[];
  unstakedPositions: PoolPositionModel[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
}

const SelectLiquidity: React.FC<SelectLiquidityProps> = ({
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
        <input
          id="checkbox-all"
          type="checkbox"
          checked={checkedAll}
          onChange={e => onCheckedAll(e.target.checked)}
        />
        <label htmlFor="checkbox-all" className="select-all-label" />
        <span className="custom-label">Select All</span>
        <span className="liquidity-label">Liquidity</span>
      </div>
      <ul>
        {stakedPositions.map((position, index) => (
          <SelectLiquidityItem
            position={position}
            checkedList={checkedList}
            onCheckedItem={onCheckedItem}
            key={index}
          />
        ))}
        {unstakedPositions.map((position, index) => (
          <SelectLiquidityItem
            position={position}
            checkedList={checkedList}
            onCheckedItem={onCheckedItem}
            key={index}
            disabled
          />
        ))}
        {unstakedPositions.length === 0 && stakedPositions.length === 0 && <div className="no-position">No Position</div>}
      </ul>
    </div>
  );
};

export default SelectLiquidity;
