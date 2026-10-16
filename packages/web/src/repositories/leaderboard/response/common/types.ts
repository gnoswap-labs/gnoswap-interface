import { YN_TYPE, YnType } from "@common/types/global-prop-types";

export const LeaderboardVisibilityStatus = {
  HIDDEN: YN_TYPE.YES,
  VISIBLE: YN_TYPE.NO,
} as const satisfies Record<string, YnType>;

export type LeaderboardVisibilityStatus =
  (typeof LeaderboardVisibilityStatus)[keyof typeof LeaderboardVisibilityStatus];

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
  // Round the points belong to.
  roundId: number;
  positionStakingPoint: string;
  gnsDelegationPoint: string;
  // Accepted swap points after the wallet and global caps.
  swapPoint: string;
  // Swap points before the caps.
  swapRawPoint: string;
  // Wallet swap cap: GNS delegation points and position staking points weighted by the round multipliers.
  swapCapPoint: string;
  isProvisional: boolean;
  usdDetail: LeaderboardUsdDetail | null;
  // Current holdings behind the points. Optional: older API responses omit it.
  holdingDetail?: LeaderboardHoldingDetail | null;
}

export interface LeaderboardHoldingDetail {
  // Currently delegated GNS in base units.
  delegatedGnsAmount: string;
  stakedPositionCount: number;
  inRangePositionCount: number;
}

export interface LeaderboardUsdDetail {
  swapFeeUsd: string;
  delegatedGnsUsd: string;
}
