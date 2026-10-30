import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const APR_COPY_KEYS = {
  title: "Governance:summary.apr.title",
  protocolFees: "Governance:summary.aprBreakdown.protocolFees",
  emission: "Governance:summary.aprBreakdown.emission",
  emissionShort: "Governance:summary.aprBreakdown.emissionShort",
  period: "Governance:summary.aprBreakdown.period",
  periodShort: "Governance:summary.aprBreakdown.periodShort",
  fees: "common:barChart.fees",
  history: "Governance:summary.aprBreakdown.history",
  date: "Governance:myDel.tooltip.date",
  dailyApr: "Governance:summary.aprHistory.dailyApr",
  unavailable: "Governance:summary.aprBreakdown.unavailable",
  disclosure: "Governance:summary.aprBreakdown.disclosure",
} as const;

export const UNAVAILABLE_APR = "—";

/** Uses the Governance namespace downloaded from i18nexus, including in previews. */
export const useXgnsAprCopy = (language?: string) => {
  const { t } = useTranslation(["Governance", "common"]);

  return useCallback(
    (key: keyof typeof APR_COPY_KEYS): string => t(APR_COPY_KEYS[key], { lng: language }),
    [t, language],
  );
};

/**
 * Formats an optional APR string. Missing/blank/non-numeric values render as an em dash
 * (never derived from the total); a legitimate zero renders as 0.00%.
 */
export const formatXgnsApr = (value?: string | number | null): string => {
  if (value === undefined || value === null) return UNAVAILABLE_APR;
  if (typeof value === "string" && value.trim() === "") return UNAVAILABLE_APR;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return UNAVAILABLE_APR;
  return `${parsed.toFixed(2)}%`;
};
