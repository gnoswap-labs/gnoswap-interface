import { TokenModel } from "@models/token/token-model";

export interface PositionRewardInfo {
  token: TokenModel;
  balance: number;
  balanceUSD: number;
}
