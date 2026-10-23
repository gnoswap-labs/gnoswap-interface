export interface IBalancesByAddressResponse {
  data: Balance[];
  message: string;
}

export interface IGrc20BalanceReceiptResponse extends IBalancesByAddressResponse {
  accountBalanceApplied: boolean;
  balanceChanges: { path: string; amount: string }[];
}

export interface IGrc20BalanceReceiptWireResponse {
  message: string;
  data: {
    applied: boolean;
    balances: Balance[];
    balanceChanges: { path: string; amount: string }[];
  };
}

export interface Balance {
  path: string;
  amount: string;
  updatedBlockHeight?: number;
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
