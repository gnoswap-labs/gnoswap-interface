import { ValuesType } from "utility-types";

export const FEE_RATE_OPTION = {
  FEE_01: "0.01%",
  FEE_05: "0.05%",
  FEE_3: "0.3%",
  FEE_1: "1%",
} as const;
export type FEE_RATE_OPTION = ValuesType<typeof FEE_RATE_OPTION>;

export const STAKED_OPTION = {
  NONE: "NONE",
  STAKED: "Staked",
  UNSTAKING: "Unstaking",
  UNSTAKED: "Unstaked",
} as const;
export type STAKED_OPTION = ValuesType<typeof STAKED_OPTION>;

export const STATUS_OPTION = {
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILED: "FAILED",
} as const;
export type STATUS_OPTION = ValuesType<typeof STATUS_OPTION>;

export const ACTIVE_STATUS_OPTION = {
  NONE: "NONE",
  ACTIVE: "ACTIVE",
  IN_ACTIVE: "IN_ACTIVE",
} as const;
export type ACTIVE_STATUS_OPTION = ValuesType<typeof ACTIVE_STATUS_OPTION>;

export const RANGE_STATUS_OPTION = {
  NONE: "NONE",
  IN: "IN",
  OUT: "OUT",
} as const;
export type RANGE_STATUS_OPTION = ValuesType<typeof RANGE_STATUS_OPTION>;

export const MATH_NEGATIVE_TYPE = {
  NEGATIVE: "NEGATIVE",
  POSITIVE: "POSITIVE",
  NONE: "NONE",
} as const;
export type MATH_NEGATIVE_TYPE = ValuesType<typeof MATH_NEGATIVE_TYPE>;

export const INCENTIVIZED_TYPE = {
  INCENTIVIZED: "Incentivized",
  NON_INCENTIVIZED: "Non_Incentivized",
  EXTERNAL_INCENTIVIZED: "External_Incentivized",
} as const;
export type INCENTIVIZED_TYPE = ValuesType<typeof INCENTIVIZED_TYPE>;

export const CHART_TYPE = {
  "7D": "7D",
  "1M": "1M",
  "1Y": "1Y",
  YTD: "YTD",
} as const;
export type CHART_TYPE = ValuesType<typeof CHART_TYPE>;

export type IncentivizedOptions =
  | "INCENTIVIZED"
  | "NON_INCENTIVIZED"
  | "EXTERNAL_INCENTIVIZED";
