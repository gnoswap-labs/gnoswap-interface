import React from "react";
import RemoveLiquiditySelectListItem from "@components/remove/remove-liquidity-select-list-item/RemoveLiquiditySelectListItem";
import { wrapper } from "./RemoveLiquiditySelectList.styles";

interface RemoveLiquiditySelectListProps {
  list: any[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, tokenId: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
}

const RemoveLiquiditySelectList: React.FC<RemoveLiquiditySelectListProps> = ({
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
        <label htmlFor="checkbox-all"> Select All</label>
        <span>Liquidity</span>
      </div>
      <ul>
        {list.map((item, idx) => (
          <RemoveLiquiditySelectListItem
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

export default RemoveLiquiditySelectList;
