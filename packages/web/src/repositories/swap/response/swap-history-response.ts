import { TokenModel } from "@models/token/token-model";

export interface SwapHistoryItem {
  fromToken: TokenModel;

  toToken: TokenModel;

  fromTokenAmount: string;

  toTokenAmount: string;

  fromUsdValue: string;

  toUsdValue: string;

  time: string;

  totalUsd: string;

  txHash: string;
}
