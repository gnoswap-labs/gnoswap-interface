import { ValuesType } from "utility-types";

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface PoolSortOption {
  key: TABLE_HEAD;
  direction: SortDirection;
}

export const TABLE_HEAD = {
  POOL_NAME: { label: "Earn:poolList.col.poolName" },
  TVL: { label: "TVL" },
  VOLUME: { label: "Earn:poolList.col.volume" },
  FEES: { label: "Earn:poolList.col.fee" },
  APR: { label: "Earn:poolList.col.apr", tooltip: "business:positionPriceRangeInfo.feeApr.desc" },
  REWARDS: { label: "Earn:poolList.col.incentive" },
  LIQUIDITY_PLOT: { label: "Earn:poolList.col.liquidityPlot" },
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
