import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React from "react";
import { tooltipWrapper, wrapper } from "./SelectLiquidityListItem.styles";

interface SelectLiquidityListItemProps {
  item: any;
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
}

const TooltipContent:React.FC = () => {
  return (
    <div css={tooltipWrapper()}>
      <div>
        <div className="title">Token ID</div>
        <div className="title">#982932</div>
      </div>
      <div>
        <div className="value">
          <img src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png" />
          GNS
        </div>
        <div className="value">50.05881</div>
      </div>
      <div>
        <div className="value">
          <img src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png" />
          GNS
        </div>
        <div className="value">50.05881</div>
      </div>
    </div>
  );
};

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
      <Tooltip
        placement="top"
        FloatingContent={<TooltipContent />}
      >
        <span className="token-id">{item.path}</span>
      </Tooltip>
      <Badge text="0.3%" type={BADGE_TYPE.DARK_DEFAULT}/>
      <span className="liquidity-value">{item.liquidity}</span>
    </li>
  );
};

export default SelectLiquidityListItem;
