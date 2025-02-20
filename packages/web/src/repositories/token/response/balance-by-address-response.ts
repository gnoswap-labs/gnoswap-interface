export interface IBalancesByAddressResponse {
  data: Balance[];
  message: string;
}

export interface Balance {
  path: string;
  amount: string;
}
