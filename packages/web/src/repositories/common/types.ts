import { ValuesType } from "utility-types";

export const DexEvent = {
  SWAP: "SWAP",
  ADD: "ADD",
  REMOVE: "REMOVE",
  INCREASE: "INCREASE",
  DECREASE: "DECREASE",
  REPOSITION: "REPOSITION",
  CLAIM: "CLAIM",
  ADD_INCENTIVE: "ADD INCENTIVE",
  STAKE: "STAKE",
  UNSTAKE: "UNSTAKE",
  CLAIM_STAKING: "CLAIM STAKING",
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
  WRAP: "WRAP",
  UNWRAP: "UNWRAP",
} as const;

export type DexEventType = ValuesType<typeof DexEvent>;