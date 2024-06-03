import { RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface RewardResponse {
  rewardType: RewardType;

  rewardToken: TokenModel;

  totalAmount: string;

  claimableAmount: string;

  claimableUsd: string;

  accuReward1d: string;

  accuReward7d: string;

  apr: string;

  accuReward1D: string
}
