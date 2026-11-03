import React from "react";
import { useTranslation } from "react-i18next";

import Tooltip from "@components/common/tooltip/Tooltip";

import { OrderOverviewTooltipContent, OrderProgressBarWrapper } from "./OrderProgressBar.styles";

export interface OrderOverviewRow {
  label: string;
  value: string;
}

interface OrderProgressBarProps {
  /** 0 to 100. */
  progress: number;
  /** Rows of the Overview tooltip. No tooltip when omitted. */
  overview?: OrderOverviewRow[];
}

/** Progress of an order. Active orders show an Overview tooltip on hover, or on tap on touch devices. */
const OrderProgressBar: React.FC<OrderProgressBarProps> = ({ progress, overview }) => {
  const { t } = useTranslation();
  const clamped = Math.min(100, Math.max(0, progress));

  const bar = (
    <OrderProgressBarWrapper
      progress={clamped}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      // Focusable so a tap opens the tooltip where there is no hover.
      tabIndex={overview ? 0 : undefined}
    >
      <div className="track">
        <div className="bar" />
      </div>
    </OrderProgressBarWrapper>
  );

  if (!overview) return bar;

  return (
    <Tooltip
      placement="top"
      width="100%"
      interactive
      className="order-progress-tooltip"
      FloatingContent={
        <OrderOverviewTooltipContent>
          <span className="overview-title">{t("Swap:order.overview")}</span>
          {overview.map(row => (
            <div key={row.label} className="overview-row">
              <span className="label">{row.label}</span>
              <span className="value">{row.value}</span>
            </div>
          ))}
        </OrderOverviewTooltipContent>
      }
    >
      {bar}
    </Tooltip>
  );
};

export default OrderProgressBar;
