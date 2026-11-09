import React from "react";
import { useTranslation } from "react-i18next";

import IconAdd from "@components/common/icons/IconAdd";
import IconRemove from "@components/common/icons/IconRemove";
import { LIMIT_PRICE_PRESETS } from "@hooks/order/data/use-order-handler.utils";

import { LimitPriceControl, LimitPriceField, LimitPricePresets } from "./LimitPriceInput.styles";

interface LimitPriceInputProps {
  inputSymbol: string;
  outputSymbol: string;
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
  inputSymbol,
  outputSymbol,
  value,
  marketPrice,
  changeValue,
  stepPrice,
  applyPreset,
}) => {
  const { t } = useTranslation();
  const hasPrice = !!value;

  return (
    <LimitPriceField>
      <span className="sell-when">{t("Swap:limit.sellWhen", { symbol: inputSymbol })}</span>
      <LimitPriceControl>
        <input
          className="price-input"
          value={value}
          onChange={e => changeValue(e.target.value)}
          placeholder="0"
          inputMode="decimal"
          autoComplete="off"
          aria-label={t("Swap:limit.limitPrice")}
        />
        <span className="quote-token">{outputSymbol}</span>
        <div className="price-steps">
          <button
            type="button"
            className="step-button"
            onClick={() => stepPrice(-1)}
            disabled={!hasPrice}
            aria-label="Decrease limit price"
          >
            <IconRemove />
          </button>
          <button
            type="button"
            className="step-button"
            onClick={() => stepPrice(1)}
            disabled={!hasPrice}
            aria-label="Increase limit price"
          >
            <IconAdd />
          </button>
        </div>
      </LimitPriceControl>
      <LimitPricePresets>
        <span className="market-price">
          {t("Swap:limit.market")} {marketPrice ?? "-"} {outputSymbol}
        </span>
        <div className="preset-buttons">
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
        </div>
      </LimitPricePresets>
    </LimitPriceField>
  );
};

export default LimitPriceInput;
