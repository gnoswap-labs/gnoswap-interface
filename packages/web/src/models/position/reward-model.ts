import { RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface RewardModel {
  rewardType: RewardType;

  token: TokenModel;

  totalAmount: bigint;

  claimableAmount: bigint;

  claimableUsdValue: string;

  accumulatedRewardOf1d: string | null;

  accumulatedRewardOf7d: string | null;

  apr: number | null;

  aprOf7d: number | null;
}
