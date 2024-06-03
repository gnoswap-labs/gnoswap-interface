import { TokenModel } from "@models/token/token-model";

export interface PositionRewardInfo {
  claimableAmount: number;
  token: TokenModel;
  balance: number;
  balanceUSD: number;
  claimableUSD: number;
  accumulatedRewardOf1d: number;
  accumulatedRewardOf1dUsd: number;
}
