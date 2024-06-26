import React from "react";
import SelectLiquidityListItem from "@components/stake/select-lilquidity-list-item/SelectLiquidityListItem";
import { loadingWrapper, wrapper } from "./SelectLiquidityList.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

interface SelectLiquidityProps {
  unstakedPositions: PoolPositionModel[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  isEmpty: boolean;
  isLoading: boolean;
}

const SelectLiquidityList: React.FC<SelectLiquidityProps> = ({
  unstakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  isEmpty,
  isLoading,
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
        {isLoading && <div css={loadingWrapper}>
          <LoadingSpinner />
        </div>}
        {!isLoading && unstakedPositions.filter(item => item.closed === false).map((position, index) => (
          <SelectLiquidityListItem
            position={position}
            checkedList={checkedList}
            onCheckedItem={onCheckedItem}
            key={index}
          />
        ))}
        {!isLoading && isEmpty && <div className="no-position">No Position</div>}
      </ul>
    </div>
  );
};

export default SelectLiquidityList;
