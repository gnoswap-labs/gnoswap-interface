import { TokenModel } from "@models/token/token-model";

export interface SwapHistoryItem {
  fromToken: TokenModel;

  toToken: TokenModel;

  fromTokenAmount: string;

  toTokenAmount: string;

  time: string;

  totalUsd: string;

  txHash: string;
}

export interface SwapHistoryResponse {
  swaps: SwapHistoryItem[];
}
