import { RewardType, DisplayRewardType } from "@constants/option.constant";

/**
 * Functions that map RewardType to DisplayRewardType
 * @param rewardType Original RewardType
 * @returns Reward types for display
 */
export const mapToDisplayRewardType = (rewardType: RewardType): DisplayRewardType => {
  if (rewardType === "SWAP_FEE") return "SWAP_FEE";
  if (rewardType === "EXTERNAL_REWARD") return "EXTERNAL_REWARD";
  if (
    rewardType === "INTERNAL_REWARD_TIER1" ||
    rewardType === "INTERNAL_REWARD_TIER2" ||
    rewardType === "INTERNAL_REWARD_TIER3"
  ) {
    return "INTERNAL_REWARD";
  }
  return "NONE";
};

/**
 * Functions to check if the reward type is internal
 * @param rewardType
 * @returns boolean
 */
export const isInternalRewardType = (rewardType: RewardType): boolean => {
  return (
    rewardType === "INTERNAL_REWARD_TIER1" ||
    rewardType === "INTERNAL_REWARD_TIER2" ||
    rewardType === "INTERNAL_REWARD_TIER3"
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
