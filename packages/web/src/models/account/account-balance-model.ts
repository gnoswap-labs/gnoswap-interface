export interface AccountBalanceModel {
  type: "native" | "grc20" | "ibc-token" | "ibc-native";
  address: string;
  path: string;
  balance: string;
  denom: string;
}
