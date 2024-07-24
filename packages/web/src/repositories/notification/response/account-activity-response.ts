type TxType =
  | "SWAP"
  | "ADD"
  | "REMOVE"
  | "STAKE"
  | "UNSTAKE"
  | "CLAIM"
  | "WITHDRAW"
  | "DEPOSIT"
  | "DECREASE"
  | "INCREASE"
  | "REPOSITION";

export interface AccountActivity {
  txHash: string;
  actionType: TxType | (string & {});
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
