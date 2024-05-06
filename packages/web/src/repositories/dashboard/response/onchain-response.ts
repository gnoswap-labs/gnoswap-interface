export type OnchainActivityResponse = OnchainActivityData[];

export interface OnchainActivityData {
  txHash: string;
  actionType: string;
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
  priceId: string;
}
