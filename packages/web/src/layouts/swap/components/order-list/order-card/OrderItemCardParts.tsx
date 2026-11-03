import { cx } from "@emotion/css";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";

export interface OrderMetric {
  key: string;
  label: string;
  value: string;
  /** Cumulative return, shown next to the purchased amount. */
  roi?: { text: string; isNegative: boolean } | null;
}

export const OrderMetrics: React.FC<{ metrics: OrderMetric[] }> = ({ metrics }) => (
  <div className="card-metrics">
    {metrics.map(metric => (
      <div key={metric.key} className="metric">
        <span className="metric-label">{metric.label}</span>
        <span className="metric-value">
          <span className="value-text">{metric.value}</span>
          {metric.roi && <span className={cx("roi", { negative: metric.roi.isNegative })}>{metric.roi.text}</span>}
        </span>
      </div>
    ))}
  </div>
);

export const OrderStopButton: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
  <Button
    text={text}
    style={{ fullWidth: true, hierarchy: ButtonHierarchy.Primary }}
    className="button-stop"
    onClick={onClick}
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
