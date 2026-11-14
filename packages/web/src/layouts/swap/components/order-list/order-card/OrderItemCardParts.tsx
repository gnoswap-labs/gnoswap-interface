import { cx } from "@emotion/css";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import Tooltip from "@components/common/tooltip/Tooltip";

import { OrderMetricTooltipContent } from "./OrderItemCard.styles";

export interface OrderMetric {
  key: string;
  label: string;
  value: string;
  /** Unabridged value for the tooltip when the visible value uses compact formatting. */
  fullValue?: string;
  /** Secondary context next to the value, such as price deviation or the filled share. */
  annotation?: string;
  /** Cumulative return, shown next to the purchased amount. */
  roi?: { text: string; isNegative: boolean } | null;
}

export const OrderMetrics: React.FC<{ metrics: OrderMetric[]; truncateFractions?: boolean }> = ({
  metrics,
  truncateFractions = false,
}) => (
  <div className="card-metrics">
    {metrics.map(metric => {
      const fraction = truncateFractions ? metric.value.match(/^([<>]?[\d,]+\.)(\d+)(.*)$/) : null;
      const content = (
        <>
          <span className="metric-label">{metric.label}</span>
          <span className="metric-value" tabIndex={truncateFractions ? 0 : undefined}>
            <span className="value-text" title={truncateFractions ? undefined : metric.value}>
              {fraction ? (
                <>
                  <span className="value-whole">{fraction[1]}</span>
                  <span className="value-fraction">{fraction[2]}</span>
                  {fraction[3] && <span className="value-suffix">{fraction[3]}</span>}
                </>
              ) : (
                metric.value
              )}
            </span>
            {metric.roi && <span className={cx("roi", { negative: metric.roi.isNegative })}>{metric.roi.text}</span>}
            {metric.annotation && <span className="metric-annotation">{metric.annotation}</span>}
          </span>
        </>
      );
      return truncateFractions ? (
        <Tooltip
          key={metric.key}
          className="metric"
          placement="top"
          interactive
          FloatingContent={
            <OrderMetricTooltipContent>
              <div>{metric.label}</div>
              <div>
                {metric.fullValue ?? metric.value}
                {metric.annotation && ` ${metric.annotation}`}
              </div>
            </OrderMetricTooltipContent>
          }
        >
          {content}
        </Tooltip>
      ) : (
        <div key={metric.key} className="metric">
          {content}
        </div>
      );
    })}
  </div>
);

export const OrderStopButton: React.FC<{ text: string; onClick: () => void; disabled?: boolean }> = ({
  text,
  onClick,
  disabled = false,
}) => (
  <Button
    text={text}
    style={{ fullWidth: true, hierarchy: disabled ? ButtonHierarchy.Gray : ButtonHierarchy.Primary }}
    className="button-stop"
    onClick={onClick}
    disabled={disabled}
  />
);

/**
 * The Order History toggle. Hidden while the order has no trade, and the
 * history is only mounted (and fetched) while open.
 */
export const OrderHistoryToggle: React.FC<{ visible: boolean; renderHistory: () => React.ReactNode }> = ({
  visible,
  renderHistory,
}) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  if (!visible) return null;

  return (
    <>
      <button type="button" className="history-toggle" onClick={() => setOpened(prev => !prev)} aria-expanded={opened}>
        {t("Swap:order.orderHistory")}
        {opened ? <IconArrowUp className="icon-arrow" /> : <IconArrowDown className="icon-arrow" />}
      </button>
      {opened && renderHistory()}
    </>
  );
};
