import { RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface RewardResposne {
  rewardType: RewardType;

  rewardToken: TokenModel;

  totalAmount: string;

  claimableAmount: string;

  claimableUsdValue: string;

  accuReward1d: string;

  accuReward7d: string;

  apr: string;

  apr7d: string;

  aprOf7d: number;
}
