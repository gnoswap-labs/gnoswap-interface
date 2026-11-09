import BigNumber from "bignumber.js";
import React from "react";
import { useTranslation } from "react-i18next";

import WarningCard from "@components/common/warning-card/WarningCard";

import { LimitPriceWarningWrapper } from "./LimitPriceInput.styles";

interface LimitPriceWarningProps {
  value: string;
  marketPrice: string | null;
}

const NEAR_MARKET_THRESHOLD_PERCENT = 1;

const LimitPriceWarning: React.FC<LimitPriceWarningProps> = ({ value, marketPrice }) => {
  const { t } = useTranslation();
  const price = BigNumber(value);
  const market = BigNumber(marketPrice ?? "");

  if (!price.isFinite() || !market.isFinite() || price.lte(0) || market.lte(0)) return null;

  const differencePercent = price.dividedBy(market).minus(1).multipliedBy(100);
  if (differencePercent.gt(NEAR_MARKET_THRESHOLD_PERCENT)) return null;

  const text = differencePercent.lt(0)
    ? t("Swap:limit.belowMarketWarning")
    : t("Swap:limit.instantFillWarning", { percent: differencePercent.decimalPlaces(2).toFixed() });

  return (
    <LimitPriceWarningWrapper role="status">
      <WarningCard content={<p>{text}</p>} />
    </LimitPriceWarningWrapper>
  );
};

export default LimitPriceWarning;
