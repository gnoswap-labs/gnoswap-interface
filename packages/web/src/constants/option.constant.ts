import { ValuesType } from "utility-types";

export const FEE_RATE_OPTION = {
  FEE_01: "0.01%",
  FEE_05: "0.05%",
  FEE_3: "0.3%",
  FEE_1: "1%",
} as const;
export type POSITION_CONTENT_LABEL = ValuesType<typeof FEE_RATE_OPTION>;

export const STAKED_OPTION = {
  NONE: "None",
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
