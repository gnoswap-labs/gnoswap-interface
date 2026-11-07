import React from "react";
import { useTranslation } from "react-i18next";

import IconAdd from "@components/common/icons/IconAdd";
import IconRemove from "@components/common/icons/IconRemove";
import { LIMIT_PRICE_PRESETS } from "@hooks/order/data/use-order-handler.utils";

import { OrderField } from "../../order-form/OrderForm.styles";
import { LimitPriceControl, LimitPricePresets } from "./LimitPriceInput.styles";

interface LimitPriceInputProps {
  value: string;
  marketPrice: string | null;
  changeValue: (value: string) => void;
  /** Moves the price by one step (0.1%) up or down. */
  stepPrice: (direction: 1 | -1) => void;
  /** 0 selects the market price; otherwise a percentage above it. */
  applyPreset: (percent: number) => void;
}

/** Output per input the order asks for, with −/+ steps and Market / +1% / +5% / +10% presets. */
const LimitPriceInput: React.FC<LimitPriceInputProps> = ({
  value,
  marketPrice,
  changeValue,
  stepPrice,
  applyPreset,
}) => {
  const { t } = useTranslation();
  const hasPrice = !!value;

  return (
    <OrderField className="centered wide">
      <span className="field-label">{t("Swap:limit.limitPrice")}</span>
      <LimitPriceControl>
        <button
          type="button"
          className="step-button"
          onClick={() => stepPrice(-1)}
          disabled={!hasPrice}
          aria-label="Decrease limit price"
        >
          <IconRemove />
        </button>
        <input
          className="price-input"
          value={value}
          onChange={e => changeValue(e.target.value)}
          placeholder="0"
          inputMode="decimal"
          autoComplete="off"
          aria-label={t("Swap:limit.limitPrice")}
        />
        <button
          type="button"
          className="step-button"
          onClick={() => stepPrice(1)}
          disabled={!hasPrice}
          aria-label="Increase limit price"
        >
          <IconAdd />
        </button>
      </LimitPriceControl>
      <LimitPricePresets>
        <button type="button" className="preset-button" onClick={() => applyPreset(0)} disabled={!marketPrice}>
          {t("Swap:limit.market")}
        </button>
        {LIMIT_PRICE_PRESETS.map(percent => (
          <button
            type="button"
            key={percent}
            className="preset-button"
            onClick={() => applyPreset(percent)}
            disabled={!marketPrice}
          >
            {`+${percent}%`}
          </button>
        ))}
      </LimitPricePresets>
    </OrderField>
  );
};

export default LimitPriceInput;
