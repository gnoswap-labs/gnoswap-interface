export interface PositionRewardTokenAmount {
  tokenPath: string;
  amount: string;
  usdValue: string;
}

export interface PositionRewardsGroupResponse {
  swapFee: PositionRewardTokenAmount[];
  internalReward: PositionRewardTokenAmount[];
  externalReward: PositionRewardTokenAmount[];
}

export interface PositionRewardsTotalUsdGroup {
  swapFee: string;
  internalReward: string;
  externalReward: string;
  total: string;
}

export interface PositionRewardsTotalUsd {
  claimed: PositionRewardsTotalUsdGroup;
  claimable: PositionRewardsTotalUsdGroup;
}

export interface PositionRewardsResponse {
  claimed: PositionRewardsGroupResponse;
  claimable: PositionRewardsGroupResponse;
  totalUsd: PositionRewardsTotalUsd;
  positionsWithSwapFee: string[];
  positionsWithStakingReward: string[];
}
