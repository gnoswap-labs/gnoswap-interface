import React from "react";
import SelectLiquidityItem from "@components/unstake/select-liquidity-item/SelectLiquidityItem";
import { wrapper } from "./SelectLiquidity.styles";

interface SelectLiquidityProps {
  list: any[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
}

const SelectLiquidity: React.FC<SelectLiquidityProps> = ({
  list,
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
        <label htmlFor="checkbox-all" className="select-all-label">
          Select All
        </label>
        <span className="period-label">Period</span>
        <span className="liquidity-label">Liquidity</span>
      </div>
      <ul>
        {list.map((item, idx) => (
          <SelectLiquidityItem
            item={item}
            checkedList={checkedList}
            onCheckedItem={onCheckedItem}
            key={idx}
          />
        ))}
      </ul>
    </div>
  );
};

export default SelectLiquidity;
