import { RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface RewardResposne {
  rewardType: RewardType;

  token: TokenModel;

  totalAmount: bigint;

  claimableAmount: bigint;

  accumulatedRewardOf1d: string;

  accumulatedRewardOf7d: string;

  apr: number;

  aprOf7d: number;
}
