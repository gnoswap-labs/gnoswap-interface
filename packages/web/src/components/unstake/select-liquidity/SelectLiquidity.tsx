import React from "react";
import SelectLiquidityItem from "@components/unstake/select-liquidity-item/SelectLiquidityItem";
import { wrapper } from "./SelectLiquidity.styles";
import { DEVICE_TYPE } from "@styles/media";

interface SelectLiquidityProps {
  list: any[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  breakpoint: DEVICE_TYPE;
}

const SelectLiquidity: React.FC<SelectLiquidityProps> = ({
  list,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  breakpoint,
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
        {list.map((item, idx) => (
          <SelectLiquidityItem
            item={item}
            checkedList={checkedList}
            onCheckedItem={onCheckedItem}
            key={idx}
            breakpoint={breakpoint}
          />
        ))}
      </ul>
    </div>
  );
};

export default SelectLiquidity;
