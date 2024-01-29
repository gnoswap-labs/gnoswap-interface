import { TokenModel } from "@models/token/token-model";

export interface PositionBalanceInfo {
  token: TokenModel;
  balance: number;
  balanceUSD: number;
  percent: string;
}
