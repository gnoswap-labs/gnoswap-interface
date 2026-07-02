import { RewardType } from "@constants/option.constant";
import { RewardTokenModel } from "@models/position/reward-model";

export interface RewardResponse {
  rewardType: RewardType;

  rewardToken: RewardTokenModel;

  totalAmount: string;

  claimableAmount: string;

  claimableUsd: string;

  apr: string;
}
