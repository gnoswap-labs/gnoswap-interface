import React from "react";

import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";

import { OrderInfoRowsWrapper, OrderInfoTooltipContent } from "./OrderInfoRows.styles";

export interface OrderInfoRow {
  key: string;
  label: string;
  tooltip?: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
}

export const OrderInfoTooltip: React.FC<{ content: string }> = ({ content }) => (
  <Tooltip placement="top" FloatingContent={<OrderInfoTooltipContent>{content}</OrderInfoTooltipContent>}>
    <IconInfo className="icon-info" size={16} />
  </Tooltip>
);

interface OrderInfoRowsProps {
  rows: OrderInfoRow[];
  className?: string;
}

/** Label / value rows used by the order detail panels and confirm modals. */
const OrderInfoRows: React.FC<OrderInfoRowsProps> = ({ rows, className }) => {
  return (
    <OrderInfoRowsWrapper className={className}>
      {rows.map(row => (
        <div key={row.key} className="info-row">
          <span className="info-label">
            {row.label}
            {row.tooltip && <OrderInfoTooltip content={row.tooltip} />}
          </span>
          <div className="info-value">
            <span className="main-value">{row.value}</span>
            {row.subValue && <span className="sub-value">{row.subValue}</span>}
          </div>
        </div>
      ))}
    </OrderInfoRowsWrapper>
  );
};

export default OrderInfoRows;
