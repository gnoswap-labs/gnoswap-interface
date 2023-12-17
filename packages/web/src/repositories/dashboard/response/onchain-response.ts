export type OnchainActivityResponse = OnchainActivityData[];

export interface OnchainActivityData {
  txHash: string;
  actionType: string;
  token0: OnchainToken;
  token1: OnchainToken;
  token0Amount: string;
  token1Amount: string;
  totalUsdValue: string;
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
