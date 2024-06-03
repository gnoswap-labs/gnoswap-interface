import { RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface PositionClaimInfo {
  rewardType: RewardType;
  token: TokenModel;
  balance: number;
  balanceUSD: number;
  claimableAmount: number;
  claimableUSD: number;
  accumulatedRewardOf1d: number;
  accumulatedRewardOf1dUsd: number;
  claimableUsdValue: number;
}
