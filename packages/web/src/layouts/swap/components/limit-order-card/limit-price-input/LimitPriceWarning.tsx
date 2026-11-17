import BigNumber from "bignumber.js";
import React from "react";
import { useTranslation } from "react-i18next";

import WarningCard from "@components/common/warning-card/WarningCard";
import { LimitOrderSide } from "@models/order/order-type";

import { LimitPriceWarningWrapper } from "./LimitPriceInput.styles";

interface LimitPriceWarningProps {
  orderSide: LimitOrderSide;
  value: string;
  marketPrice: string | null;
}

const LimitPriceWarning: React.FC<LimitPriceWarningProps> = ({ orderSide, value, marketPrice }) => {
  const { t } = useTranslation();
  const price = BigNumber(value);
  const market = BigNumber(marketPrice ?? "");

  if (!price.isFinite() || !market.isFinite() || price.lte(0) || market.lte(0)) return null;

  const isMarketable = orderSide === "buy" ? price.gte(market) : price.lte(market);
  if (!isMarketable) return null;

  const text = price.eq(market)
    ? t("Swap:limit.instantFillWarning")
    : orderSide === "buy"
      ? t("Swap:limit.aboveMarketWarning", {
          defaultValue: "Trigger price is above market and your order may instantly fill.",
        })
      : t("Swap:limit.belowMarketWarning");

  return (
    <LimitPriceWarningWrapper role="status">
      <WarningCard content={<p>{text}</p>} />
    </LimitPriceWarningWrapper>
  );
};

export default LimitPriceWarning;
