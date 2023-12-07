import { TokenModel } from "@models/token/token-model";

export interface RewardModel {
  rewardType: "SWAP_FEE" | "STAKING_REWARD" | "EXTERNAL_REWARD";

  token: TokenModel;

  claimableRewardAmount: bigint;

  totalRewardAmount: bigint;

  accumulatedRewardOf7d: string;

  changedOf1d: string;
}
