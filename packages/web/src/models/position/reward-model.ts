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

  apr: number | null;
}

export interface ClaimedRewardModel {
  rewardType: RewardType;

  rewardToken: RewardTokenModel;

  claimedAmount: string;
}
