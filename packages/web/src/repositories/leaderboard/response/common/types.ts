import { YN_TYPE, YnType } from "@common/types/global-prop-types";

export const LeaderboardVisibilityStatus = {
  HIDDEN: YN_TYPE.YES,
  VISIBLE: YN_TYPE.NO,
} as const satisfies Record<string, YnType>;

export type LeaderboardVisibilityStatus = (typeof LeaderboardVisibilityStatus)[keyof typeof LeaderboardVisibilityStatus];

export interface LeaderboardUser {
  accountAddress: string;
  accountName: string;
  governanceRewardsPoint: string;
  governanceRewardsUsd: string;
  hiddenYn: LeaderboardVisibilityStatus;
  paidSwapFeePoint: string;
  providedLiquidityFeePoint: string;
  providedLiquidityFeeUsd: string;
  rank: number;
  referralPoint: string;
  referrerAddress: string;
  stakingRewardsPoint: string;
  stakingRewardsUsd: string;
  swapFeeUsd: string;
  totalPoint: string;
}
