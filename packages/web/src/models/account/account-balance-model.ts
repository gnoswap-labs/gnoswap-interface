export interface AccountBalanceModel {
  type: "GRC20" | "ibc-token" | "ibc-native";
  address: string;
  path: string;
  balance: string;
  denom: string;
}
