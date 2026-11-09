import React from "react";
import { useTranslation } from "react-i18next";

import { OrderSelectOption } from "@components/order/order-select-box/OrderSelectBox";
import ChartScopeSelectTab from "@layouts/pool/pool-add/components/additional-info/exchange-rate-graph/chart-scope-select-tab/ChartScopeSelectTab";

import { LimitExpiryRow } from "./LimitExpirySelect.styles";

interface LimitExpirySelectProps {
  expiry: number;
  options: OrderSelectOption<number>[];
  changeExpiry: (duration: number) => void;
}

const SHORT_EXPIRY_LABELS: Record<number, string> = {
  3_600: "1H",
  86_400: "1D",
  604_800: "1W",
  2_592_000: "30D",
};

/** How long the order stays open. Options outside the configured duration range are hidden. */
const LimitExpirySelect: React.FC<LimitExpirySelectProps> = ({ expiry, options, changeExpiry }) => {
  const { t } = useTranslation();

  return (
    <LimitExpiryRow>
      <span className="expiry-label">{t("Swap:limit.expiresIn")}</span>
      <ChartScopeSelectTab
        size="SMALL"
        selected={String(expiry)}
        list={options.map(option => ({
          key: String(option.value),
          display: SHORT_EXPIRY_LABELS[option.value] ?? option.label,
        }))}
        onChange={value => changeExpiry(Number(value))}
      />
    </LimitExpiryRow>
  );
};

export default LimitExpirySelect;
