import { RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface PositionClaimInfo {
  rewardType: RewardType;
  token: TokenModel;
  claimableAmount: number | null;
  claimableUSD: number | null;
  accumulatedRewardOf1d: number | null;
  accumulatedRewardOf1dUsd: number | null;
}
