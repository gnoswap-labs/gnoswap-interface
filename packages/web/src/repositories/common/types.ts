import { ValuesType } from "utility-types";

export const DexEvent = {
  SWAP: "SWAP",
  ADD: "ADD",
  REMOVE: "REMOVE",
  INCREASE: "INCREASE",
  DECREASE: "DECREASE",
  REPOSITION: "REPOSITION",
  CLAIM_FEE: "CLAIM_FEE",
  ADD_INCENTIVE: "ADD_INCENTIVE",
  STAKE: "STAKE",
  UNSTAKE: "UNSTAKE",
  CLAIM_REWARD: "CLAIM_REWARD",
  ASSET_RECEIVE: "ASSET_RECEIVE",
  ASSET_SEND: "ASSET_SEND",
  WRAP: "WRAP",
  UNWRAP: "UNWRAP",
} as const;

export type DexEventType = ValuesType<typeof DexEvent>;

export interface APIResponse<T = unknown> {
  error: {
    code?: number;
    msg?: string;
  };
  data: T;
}
