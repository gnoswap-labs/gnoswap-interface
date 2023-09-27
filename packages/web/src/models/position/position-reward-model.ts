import { TokenModel } from "@models/token/token-model";

export interface PositionRewardModel {
  rewardId: string;

  rewardType: string;

  poolTier: number;

  poolRatio: number;

  stakingTier: number;

  finishAt: number;

  rewardBalance: number;

  token: TokenModel;

  tokenPrice: number;

  totalRewardsPerDay: number;

  lpTokenId: string;
}
