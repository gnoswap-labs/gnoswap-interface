import React from "react";
import { Trans, useTranslation } from "react-i18next";

import IconAdd from "@components/common/icons/IconAdd";
import IconRemove from "@components/common/icons/IconRemove";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { LIMIT_PRICE_PRESETS } from "@hooks/order/data/use-order-handler.utils";
import { LimitOrderSide } from "@models/order/order-type";
import { formatOrderMarketPrice } from "@utils/order-format-utils";

import { LimitPriceControl, LimitPriceField, LimitPricePresets } from "./LimitPriceInput.styles";

interface LimitPriceInputProps {
  orderSide: LimitOrderSide;
  inputSymbol: string;
  inputLogoURI?: string;
  outputSymbol: string;
  value: string;
  valueUsd: string;
  marketPrice: string | null;
  selectedPreset: number | null;
  changeValue: (value: string) => void;
  /** Moves the price by one step (0.1%) up or down. */
  stepPrice: (direction: 1 | -1) => void;
  /** Market, or a signed percentage from the base asset's market price. */
  applyPreset: (percent: number) => void;
}

/** Price of one base asset in quote tokens, independent of the actual swap direction. */
const LimitPriceInput: React.FC<LimitPriceInputProps> = ({
  orderSide,
  inputSymbol,
  inputLogoURI,
  outputSymbol,
  value,
  valueUsd,
  marketPrice,
  selectedPreset,
  changeValue,
  stepPrice,
  applyPreset,
}) => {
  const { t } = useTranslation();
  const hasPrice = !!value;
  const displayMarketPrice = formatOrderMarketPrice(marketPrice);

  return (
    <LimitPriceField>
      <span className="sell-when">
        <Trans
          defaults={
            orderSide === "buy"
              ? t("Swap:limit.buyWhen", { defaultValue: "When 1 {{symbol}} drops to", symbol: "<token/>" })
              : t("Swap:limit.sellWhen", { symbol: "<token/>" })
          }
          components={{
            token: (
              <span className="sell-token">
                <span aria-hidden="true">
                  <MissingLogo symbol={inputSymbol} url={inputLogoURI} width={16} mobileWidth={16} />
                </span>
                {inputSymbol}
              </span>
            ),
          }}
        />
      </span>
      <LimitPriceControl>
        <div className="price-quote">
          <input
            className="price-input"
            value={value}
            size={Math.max(value.length, 1)}
            onChange={e => changeValue(e.target.value)}
            placeholder="0"
            inputMode="decimal"
            autoComplete="off"
            aria-label={t("Swap:limit.limitPrice")}
          />
          <span className="quote-token">{outputSymbol}</span>
          <span className="price-usd">{valueUsd === "-" ? "(-)" : `(≈ ${valueUsd})`}</span>
        </div>
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
        <span className="market-price" title={`${t("Swap:limit.marketPrice")} ${marketPrice ?? "-"} ${outputSymbol}`}>
          {t("Swap:limit.marketPrice")} {displayMarketPrice ?? "-"} {outputSymbol}
        </span>
        <div className="preset-buttons">
          <button
            type="button"
            className="preset-button"
            aria-pressed={selectedPreset === 0}
            onClick={() => applyPreset(0)}
            disabled={!marketPrice}
          >
            {t("Swap:limit.market")}
          </button>
          {LIMIT_PRICE_PRESETS.map(preset => {
            const percent = orderSide === "buy" ? -preset : preset;
            return (
              <button
                type="button"
                key={percent}
                className="preset-button"
                aria-pressed={selectedPreset === percent}
                onClick={() => applyPreset(percent)}
                disabled={!marketPrice}
              >
                {`${percent > 0 ? "+" : ""}${percent}%`}
              </button>
            );
          })}
        </div>
      </LimitPricePresets>
    </LimitPriceField>
  );
};

export default LimitPriceInput;
