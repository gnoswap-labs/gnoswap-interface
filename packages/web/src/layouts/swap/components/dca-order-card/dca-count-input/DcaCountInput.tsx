import React from "react";
import { useTranslation } from "react-i18next";

import { OrderInfoTooltip } from "@components/order/order-info-rows/OrderInfoRows";

import { OrderField } from "../../order-form/OrderForm.styles";

interface DcaCountInputProps {
  value: string;
  maxExecutionCount: number;
  changeValue: (value: string) => void;
  /** Clamps the typed value into `[2, max]`. */
  commitValue: () => void;
}

/** `Over`: how many executions the order is split into. */
const DcaCountInput: React.FC<DcaCountInputProps> = ({ value, maxExecutionCount, changeValue, commitValue }) => {
  const { t } = useTranslation();

  return (
    <OrderField>
      <span className="field-label">
        {t("Swap:dca.over")}
        <OrderInfoTooltip content={t("Swap:dca.overTooltip")} />
      </span>
      <div className="field-value">
        <input
          className="field-input"
          value={value}
          onChange={e => changeValue(e.target.value)}
          onBlur={commitValue}
          onKeyDown={e => {
            if (e.key === "Enter") commitValue();
          }}
          inputMode="numeric"
          autoComplete="off"
          aria-label={t("Swap:dca.over")}
          title={`2 - ${maxExecutionCount}`}
        />
        <span className="field-badge">{t("Swap:dca.orders")}</span>
      </div>
    </OrderField>
  );
};

export default DcaCountInput;
