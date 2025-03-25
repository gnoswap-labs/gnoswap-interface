import { RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface RewardTokenModel extends TokenModel {
  rewardType: RewardType;
}

export interface RewardModel {
  rewardToken: RewardTokenModel;

  totalAmount: string;

  claimableAmount: string;

  claimableUsd: string;

  accuReward1D: string | null;

  apr: number | null;
}

export interface ClaimedRewardModel {
  rewardType: RewardType;

  rewardToken: TokenModel;

  claimedAmount: string;
}
