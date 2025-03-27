import { DisplayRewardType, RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

/**
 * About rewards main interface
 */
export interface BaseRewardInfo {
  rewardType: RewardType | DisplayRewardType;
  token: TokenModel;
  amount: number | null;
  usd: number | null;
}

/**
 * Position reward information interface to display in tooltips
 */
export interface PositionRewardForTooltip extends BaseRewardInfo {
  accumulatedRewardOf1d: number | null;
  accumulatedRewardOf1dUsd: number | null;
}

/**
 * Rewards information map type
 */
export type RewardInfoMap =
  | {
      [key in DisplayRewardType]: PositionRewardForTooltip[];
    }
  | null;
