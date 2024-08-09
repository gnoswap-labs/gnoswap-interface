import { DexEventType } from "@repositories/common";

export type ActivityResponse = ActivityData[];

export interface ActivityData {
  txHash: string;
  actionType: DexEventType;
  tokenA: OnchainToken;
  tokenB: OnchainToken;
  tokenAAmount: string;
  tokenBAmount: string;
  totalUsd: string;
  usedTokens?: number;
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
