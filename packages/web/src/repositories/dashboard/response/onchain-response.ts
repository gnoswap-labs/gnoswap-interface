import { ValuesType } from "utility-types";

export type OnchainActivityResponse = OnchainActivityData[];

export const OnchainActivityAction = {
  SWAP: "SWAP",
  ADD: "ADD",
  REMOVE: "REMOVE",
  STAKE: "STAKE",
  UNSTAKE: "UNSTAKE",
  CLAIM: "CLAIM",
  INCREASE: "INCREASE",
  DECREASE: "DECREASE",
  REPOSITION: "REPOSITION",
} as const;

export type OnchainActivityActionType = ValuesType<
  typeof OnchainActivityAction
>;
export interface OnchainActivityData {
  txHash: string;
  actionType: OnchainActivityActionType;
  tokenA: OnchainToken;
  tokenB: OnchainToken;
  tokenAAmount: string;
  tokenBAmount: string;
  totalUsd: string;
  account: string;
  time: string;
}

export interface OnchainToken {
  type: string;
  chainId: string;
  createdAt: string;
  name: string;
  path: string;
  decimals: number;
  symbol: string;
  logoURI: string;
  priceID: string;
}
