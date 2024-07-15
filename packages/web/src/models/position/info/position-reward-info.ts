import { TokenModel } from "@models/token/token-model";

export interface PositionRewardInfo {
  claimableAmount: number;
  token: TokenModel;
  balance: number;
  balanceUSD: number;
  claimableUSD: number | null;
  accumulatedRewardOf1d: number | null;
  accumulatedRewardOf1dUsd: number | null;
}
