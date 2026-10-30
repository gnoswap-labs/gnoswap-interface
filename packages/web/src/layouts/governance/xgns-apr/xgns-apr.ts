import { useCallback } from "react";
import { useTranslation } from "react-i18next";

type XgnsAprCopyKey =
  | "title"
  | "tooltip"
  | "protocolFees"
  | "protocolFeesPeriod"
  | "emission"
  | "emissionPeriod"
  | "protocolFeesShort"
  | "protocolFeesPeriodShort"
  | "emissionShort"
  | "emissionPeriodShort"
  | "history"
  | "historyTitle"
  | "date"
  | "dailyApr"
  | "unavailable"
  | "disclosure";

export const UNAVAILABLE_APR = "—";

/** Uses the Governance namespace downloaded from i18nexus, including in previews. */
export const useXgnsAprCopy = (language?: string) => {
  const { t } = useTranslation("Governance");

  return useCallback(
    (key: XgnsAprCopyKey): string => t(`summary.aprBreakdown.${key}`, { lng: language }),
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
