export enum LeaderboardVisibilityStatus {
  HIDDEN = "Y",
  VISIBLE = "N",
}

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
