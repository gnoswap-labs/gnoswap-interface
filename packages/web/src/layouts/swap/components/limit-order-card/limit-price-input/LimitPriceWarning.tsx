import BigNumber from "bignumber.js";
import React from "react";
import { useTranslation } from "react-i18next";

import WarningCard from "@components/common/warning-card/WarningCard";

import { LimitPriceWarningWrapper } from "./LimitPriceInput.styles";

interface LimitPriceWarningProps {
  value: string;
  marketPrice: string | null;
}

const LimitPriceWarning: React.FC<LimitPriceWarningProps> = ({ value, marketPrice }) => {
  const { t } = useTranslation();
  const price = BigNumber(value);
  const market = BigNumber(marketPrice ?? "");

  if (!price.isFinite() || !market.isFinite() || price.lte(0) || market.lte(0)) return null;

  if (price.gt(market)) return null;

  const text = price.lt(market) ? t("Swap:limit.belowMarketWarning") : t("Swap:limit.instantFillWarning");

  return (
    <LimitPriceWarningWrapper role="status">
      <WarningCard content={<p>{text}</p>} />
    </LimitPriceWarningWrapper>
  );
};

export default LimitPriceWarning;
