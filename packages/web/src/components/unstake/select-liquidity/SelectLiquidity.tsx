import React from "react";
import SelectLiquidityItem from "@components/unstake/select-liquidity-item/SelectLiquidityItem";
import { loadingWrapper, wrapper } from "./SelectLiquidity.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

interface SelectLiquidityProps {
  stakedPositions: PoolPositionModel[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  isLoading: boolean;
}

const SelectLiquidity: React.FC<SelectLiquidityProps> = ({
  stakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  isLoading,
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
        {isLoading && <div css={loadingWrapper}>
          <LoadingSpinner />
        </div>}
        {!isLoading && stakedPositions.map((position, index) => (
          <SelectLiquidityItem
            position={position}
            checkedList={checkedList}
            onCheckedItem={onCheckedItem}
            key={index}
          />
        ))}
        {!isLoading && stakedPositions.length === 0 && <div className="no-position">No Position</div>}
      </ul>
    </div>
  );
};

export default SelectLiquidity;
