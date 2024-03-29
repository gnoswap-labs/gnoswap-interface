export interface IBalancesByAddressResponse {
  address: string;
  balances: Balance[];
}

export interface Balance {
  type: string;
  path: string;
  address: string;
  balance: string;
  denom: string;
}
