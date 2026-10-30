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

/** Daily scheduled-accrual APR components. The emission step models a historical ratio change. */
export const SAMPLE_XGNS_APR_HISTORY: GovernanceAPRHistory[] = [
  {
    date: "2026-10-29",
    apr: "14.31",
    protocolFeeApr: "4.81",
    emissionApr: "9.50",
    estimated: true,
    asOf: "2026-10-29T09:00:00Z",
  },
  { date: "2026-10-28", apr: "14.23", protocolFeeApr: "4.73", emissionApr: "9.50", estimated: false },
  { date: "2026-10-27", apr: "13.99", protocolFeeApr: "4.49", emissionApr: "9.50", estimated: false },
  { date: "2026-10-26", apr: "13.88", protocolFeeApr: "4.38", emissionApr: "9.50", estimated: false },
  { date: "2026-10-25", apr: "10.06", protocolFeeApr: "4.56", emissionApr: "5.50", estimated: false },
  { date: "2026-10-24", apr: "10.12", protocolFeeApr: "4.62", emissionApr: "5.50", estimated: false },
  { date: "2026-10-23", apr: "9.79", protocolFeeApr: "4.33", emissionApr: "5.46", estimated: false },
];
