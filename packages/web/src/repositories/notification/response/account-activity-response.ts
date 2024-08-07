import { DexEventType } from "@repositories/common";

export interface AccountActivity {
  txHash: string;
  actionType: DexEventType | (string & {});
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
