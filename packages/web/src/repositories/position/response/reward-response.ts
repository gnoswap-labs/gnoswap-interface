import { RewardType } from "@constants/option.constant";
import { RewardTokenModel } from "@models/position/reward-model";

export interface RewardResponse {
  rewardType: RewardType;

  rewardToken: RewardTokenModel;

  totalAmount: string;

  claimableAmount: string;

  claimableUsd: string;

  accuReward1d: string;

  accuReward7d: string;

  apr: string;

  accuReward1D: string;
}
