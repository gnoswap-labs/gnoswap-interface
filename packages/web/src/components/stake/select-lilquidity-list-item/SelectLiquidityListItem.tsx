import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { convertLargePrice } from "@utils/stake-position-utils";
import React, { useRef, useState, useEffect } from "react";
import { tooltipWrapper, wrapper } from "./SelectLiquidityListItem.styles";

interface SelectLiquidityListItemProps {
  item: any;
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  width: number;
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
  width,
}) => {
  const [checkWidth, setIsCheckWidth] = useState(true);
  const leftDivRef = useRef<HTMLDivElement>(null);
  const liquidityRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWidth = Math.min(width, 500);
      const totalWidth = (leftDivRef?.current?.offsetWidth || 0) + (liquidityRef?.current?.offsetWidth || 0) + 100;
      setIsCheckWidth(windowWidth > totalWidth);
    }
  }, [liquidityRef.current, leftDivRef.current, width]);

  return (
    <li css={wrapper(checkedList.includes(item.path))}>
      <div className="left-content" ref={leftDivRef}>
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
      </div>
      <span className="liquidity-value-fake" ref={liquidityRef}>${Number(item.liquidity).toLocaleString()}</span>
      <span className="liquidity-value" >${!checkWidth ? convertLargePrice(item.liquidity) : Number(item.liquidity).toLocaleString()}</span>
    </li>
  );
};

export default SelectLiquidityListItem;
