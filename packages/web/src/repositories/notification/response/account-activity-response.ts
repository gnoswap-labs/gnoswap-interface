type TxType =
  | "SWAP"
  | "ADD"
  | "REMOVE"
  | "STAKE"
  | "UNSTAKE"
  | "CLAIM"
  | "WITHDRAW"
  | "DEPOSIT";

export interface AccountActivity {
  txHash: string;
  actionType: TxType | (string & {});
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
