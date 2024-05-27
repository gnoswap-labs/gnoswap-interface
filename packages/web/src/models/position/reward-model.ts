import { RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface RewardModel {
  rewardType: RewardType;

  rewardToken: TokenModel;

  totalAmount: number;

  claimableAmount: number;

  claimableUsd: string;

  accuReward1D: string | null;

  apr: number | null;
}
