import React from "react";
import SelectLiquidityListItem from "@components/stake/select-lilquidity-list-item/SelectLiquidityListItem";
import { wrapper } from "./SelectLiquidityList.styles";
import { DEVICE_TYPE } from "@styles/media";

interface SelectLiquidityProps {
  list: any[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  breakpoint: DEVICE_TYPE;
  checkedAll: boolean;
}

const SelectLiquidityList: React.FC<SelectLiquidityProps> = ({
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
        {list.map((item, idx) => (
          <SelectLiquidityListItem
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

export default SelectLiquidityList;
