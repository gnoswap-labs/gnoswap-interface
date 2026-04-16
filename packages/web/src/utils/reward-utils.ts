import BigNumber from "bignumber.js";

import { RewardModel } from "@models/position/reward-model";
import { RewardType, DisplayRewardType } from "@constants/option.constant";

/**
 * Functions that map RewardType to DisplayRewardType
 * @param rewardType Original RewardType
 * @returns Reward types for display
 */
export const mapToDisplayRewardType = (rewardType: RewardType): DisplayRewardType => {
  switch (rewardType) {
    case "SWAP_FEE":
      return "SWAP_FEE";
    case "EXTERNAL_REWARD":
      return "EXTERNAL_REWARD";
    case "INTERNAL_REWARD":
    case "INTERNAL_TIER_1":
    case "INTERNAL_TIER_2":
    case "INTERNAL_TIER_3":
      return "INTERNAL_REWARD";
    default:
      return "NONE";
  }
};

/**
 * Functions to check if the reward type is internal
 * @param rewardType
 * @returns boolean
 */
export const isInternalRewardType = (rewardType: RewardType): boolean => {
  return (
    rewardType === "INTERNAL_REWARD" ||
    rewardType === "INTERNAL_TIER_1" ||
    rewardType === "INTERNAL_TIER_2" ||
    rewardType === "INTERNAL_TIER_3"
  );
};

/**
 * Functions to check if reward information exists
 * @param data Rewards information map
 * @returns boolean
 */
export const hasRewardInfo = <T>(data: Record<DisplayRewardType, T[]>): boolean => {
  return data.SWAP_FEE.length > 0 || data.INTERNAL_REWARD.length > 0 || data.EXTERNAL_REWARD.length > 0;
};

/**
 * Functions to check reward claimability
 * Returns true if the reward's claimable amount is greater than 0, otherwise false
 * @param reward
 * @returns boolean
 */
export const isClaimableReward = (reward: RewardModel): boolean => {
  const claimableAmount = BigNumber(reward.claimableAmount ?? 0);
  return claimableAmount.isGreaterThan(0);
};
