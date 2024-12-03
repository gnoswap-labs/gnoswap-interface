import { ValuesType } from "utility-types";

export interface PoolSortOption {
  key: TABLE_HEAD;
  direction: "asc" | "desc";
}

export const TABLE_HEAD = {
  POOL_NAME: "Earn:poolList.col.poolName",
  TVL: "TVL",
  VOLUME: "Earn:poolList.col.volume",
  FEES: "Earn:poolList.col.fee",
  APR: "APR",
  REWARDS: "Earn:poolList.col.incentive",
  LIQUIDITY_PLOT: "Earn:poolList.col.liquidityPlot",
} as const;

export const SORT_SUPPORT_HEAD = [
  "Earn:poolList.col.poolName",
  "TVL",
  "Earn:poolList.col.volume",
  "Earn:poolList.col.fee",
  "APR",
];

export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

export const POOL_TYPE = {
  ALL: "Earn:poolList.switch.all",
  INCENTIVIZED: "Earn:poolList.switch.incenti",
  NONE_INCENTIVIZED: "Earn:poolList.switch.nonIncenti",
} as const;

export type POOL_TYPE = ValuesType<typeof POOL_TYPE>;
