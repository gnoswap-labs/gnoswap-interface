import type { GovernanceAPRHistory } from "@repositories/governance";

/**
 * SAMPLE values for local Storybook previews only. They are representative, not live,
 * and must never be used as production defaults.
 */
export const SAMPLE_APR_PREVIEW_LABEL = "SAMPLE · local preview — representative values, not live data";

export const SAMPLE_XGNS_APR = {
  totalApr: "12.34",
  protocolFeeApr: "4.56",
  emissionApr: "7.78",
} as const;

const SAMPLE_HISTORY_VALUES = [
  { apr: "14.31", protocolFeeApr: "4.81", emissionApr: "9.50" },
  { apr: "14.23", protocolFeeApr: "4.73", emissionApr: "9.50" },
  { apr: "13.99", protocolFeeApr: "4.49", emissionApr: "9.50" },
  { apr: "13.88", protocolFeeApr: "4.38", emissionApr: "9.50" },
  { apr: "10.06", protocolFeeApr: "4.56", emissionApr: "5.50" },
  { apr: "10.12", protocolFeeApr: "4.62", emissionApr: "5.50" },
  { apr: "9.79", protocolFeeApr: "4.33", emissionApr: "5.46" },
] as const;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** UTC date (YYYY-MM-DD) `daysAgo` days before today, so the sample always fills the current window. */
export const getSampleUtcDate = (daysAgo: number): string => {
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return new Date(todayUtc - daysAgo * MS_PER_DAY).toISOString().slice(0, 10);
};

/**
 * Daily scheduled-accrual APR components for today and the previous six UTC dates, latest first.
 * The emission step models a historical ratio change.
 */
export const SAMPLE_XGNS_APR_HISTORY: GovernanceAPRHistory[] = SAMPLE_HISTORY_VALUES.map((values, daysAgo) => {
  const date = getSampleUtcDate(daysAgo);
  return daysAgo === 0
    ? { date, ...values, estimated: true, asOf: `${date}T09:00:00Z` }
    : { date, ...values, estimated: false };
});
