export interface IBalancesByAddressResponse {
  data: Balance[];
  message: string;
  accountBalanceApplied?: boolean;
  balanceChanges?: { path: string; amount: string }[];
}

export interface Balance {
  path: string;
  amount: string;
  updatedBlockHeight: number;
}

export interface IGrc20TransferHistoryResponse {
  data: Grc20TransferHistory[];
  message: string;
}

export interface Grc20TransferHistory {
  fromAddress: string;
  toAddress: string;
  tokenAmount: string;
  tokenPath: string;
}
