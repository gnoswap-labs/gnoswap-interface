import { ClaimedRewardModel, RewardModel } from "./reward-model";

export interface PositionModel {
  id: number;

  lpTokenId: string;

  poolPath: string;

  staked: boolean;

  owner: string;

  tickLower: number;

  tickUpper: number;

  liquidity: bigint;

  tokenABalance: string;

  tokenBBalance: string;

  positionUsdValue: string;

  unclaimedFeeAAmount: string;

  unclaimedFeeBAmount: string;

  apr: string;

  stakedAt: string;

  rewards: RewardModel[];

  claimedRewards: ClaimedRewardModel[];

  closed: boolean;

  totalClaimedUsd: string;

  usdValue: number;

  tokenUri: string;

  // TODO: Remove later

  totalDailyRewardsUsd: string;

  stakedUsdValue: string;
}
