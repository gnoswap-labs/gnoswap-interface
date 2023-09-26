import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import React from "react";
import { wrapper } from "./SelectLiquidityListItem.styles";

interface SelectLiquidityListItemProps {
  item: any;
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
}

const SelectLiquidityListItem: React.FC<SelectLiquidityListItemProps> = ({
  item,
  checkedList,
  onCheckedItem,
}) => {
  return (
    <li css={wrapper(checkedList.includes(item.path))}>
      <input
        id={`checkbox-item-${item.path}`}
        type="checkbox"
        checked={checkedList.includes(item.path)}
        onChange={e => onCheckedItem(e.target.checked, item.path)}
      />
      <label htmlFor={`checkbox-item-${item.path}`} />
      <DoubleLogo left={item.pairLogo[0]} right={item.pairLogo[1]} size={24} />
      <span className="token-id">{item.path}</span>
      <span className="liquidity-value">{item.liquidity}</span>
    </li>
  );
};

export default SelectLiquidityListItem;
