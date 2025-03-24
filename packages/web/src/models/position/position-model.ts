import { ClaimedRewardModel, RewardModel } from "./reward-model";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { INCENTIVE_TYPE } from "@constants/option.constant";

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

  bins40: PoolBinModel[];

  closed: boolean;

  totalClaimedUsd: string;

  usdValue: number;

  incentiveType: INCENTIVE_TYPE;

  tokenUri: string;

  // TODO: Remove later

  totalDailyRewardsUsd: string;

  stakedUsdValue: string;
}
