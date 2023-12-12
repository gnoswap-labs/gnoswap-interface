import { TokenModel } from "@models/token/token-model";

export interface PositionClaimInfo {
  token: TokenModel;
  balance: number;
  balanceUSD: number;
}
