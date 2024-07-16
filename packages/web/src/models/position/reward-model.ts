import { RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface RewardModel {
  rewardType: RewardType;

  rewardToken: TokenModel;

  totalAmount: string;

  claimableAmount: string;

  claimableUsd: string;

  accuReward1D: string | null;

  apr: number | null;
}
