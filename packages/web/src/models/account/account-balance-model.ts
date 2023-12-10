export interface AccountBalanceModel {
  type: "grc20" | "grc20" | "ibc-token" | "ibc-native";
  address: string;
  path: string;
  balance: string;
  denom: string;
}
