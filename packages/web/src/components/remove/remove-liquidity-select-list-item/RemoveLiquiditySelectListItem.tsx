import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { STAKED_OPTION } from "@constants/option.constant";
import { cx } from "@emotion/css";
import React from "react";
import { wrapper } from "./RemoveLiquiditySelectListItem.styles";

interface RemoveLiquiditySelectListItemProps {
  item: any;
  checkedList: string[];
  onCheckedItem: (checked: boolean, tokenId: string) => void;
}

const RemoveLiquiditySelectListItem: React.FC<
  RemoveLiquiditySelectListItemProps
> = ({ item, checkedList, onCheckedItem }) => {
  const isUnstakedType = item.staked === STAKED_OPTION.UNSTAKED;
  return (
    <li
      css={wrapper(checkedList.includes(item.tokenId))}
      className={cx({ unsure: !isUnstakedType })}
    >
      <input
        id={`checkbox-item-${item.tokenId}`}
        type="checkbox"
        disabled={!isUnstakedType}
        checked={checkedList.includes(item.tokenId)}
        onChange={e => onCheckedItem(e.target.checked, item.tokenId)}
      />
      <label htmlFor={`checkbox-item-${item.tokenId}`} />
      <DoubleLogo left={item.pairLogo[0]} right={item.pairLogo[1]} size={24} />
      <span className="token-id">{item.tokenId}</span>
      {!isUnstakedType && (
        <div className="hover-info">
          <Tooltip
            placement="top"
            FloatingContent={
              <div>You need to unstake your liquidity first</div>
            }
          >
            <IconInfo className="icon-info" />
          </Tooltip>
        </div>
      )}
      <span className="liquidity-value">{item.liquidity}</span>
    </li>
  );
};

export default RemoveLiquiditySelectListItem;
