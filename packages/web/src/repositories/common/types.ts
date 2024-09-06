import { ValuesType } from "utility-types";

export const DexEvent = {
  // Swap
  SWAP: "SWAP",
  ADD: "ADD",
  WRAP: "WRAP",
  UNWRAP: "UNWRAP",
  // position
  REMOVE: "REMOVE",
  INCREASE: "INCREASE",
  DECREASE: "DECREASE",
  REPOSITION: "REPOSITION",
  CLAIM_FEE: "CLAIM_FEE",
  ADD_INCENTIVE: "ADD_INCENTIVE",
  STAKE: "STAKE",
  UNSTAKE: "UNSTAKE",
  CLAIM_REWARD: "CLAIM_REWARD",
  // wallet
  ASSET_RECEIVE: "ASSET_RECEIVE",
  ASSET_SEND: "ASSET_SEND",
  // governance
  DELEGATE: "DELEGATE",
  UNDELEGATE: "UNDELEGATE",
  COLLECT_UNDEL: "COLLECT_UNDEL",
  COLLECT_GOV_REWARD: "COLLECT_GOV_REWARD",
  PROPOSE_TEXT: "PROPOSE_TEXT",
  PROPOSE_COMM_POOL_SPEND: "PROPOSE_COMM_POOL_SPEND",
  PROPOSE_PARAM_CHANGE: "PROPOSE_PARAM_CHANGE",
  VOTE: "VOTE",
  EXECUTE_PROPOSAL: "EXECUTE_PROPOSAL",
  CANCEL_PROPOSAL: "CANCEL_PROPOSAL",
} as const;

export type DexEventType = ValuesType<typeof DexEvent>;

export interface APIResponse<T = unknown> {
  error: {
    code?: number;
    msg?: string;
  };
  data: T;
}
