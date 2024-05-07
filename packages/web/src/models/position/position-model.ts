import { IncentivizedOptions } from "@common/values";
import { RewardModel } from "./reward-model";
import { PoolBinModel } from "@models/pool/pool-bin-model";

export interface PositionModel {
  id: string;

  lpTokenId: string;

  incentivizedType: IncentivizedOptions;

  poolPath: string;

  staked: boolean;

  operator: string;

  tickLower: number;

  tickUpper: number;

  liquidity: bigint;

  tokenABalance: number;

  tokenBBalance: number;

  positionUsdValue: string;

  unclaimedFeeAAmount: number;

  unclaimedFeeBAmount: number;

  unclaimedFee0Usd: string;

  unclaimedFee1Usd: string;

  tokensOwed0Amount: bigint;

  tokensOwed1Amount: bigint;

  tokensOwed0Usd: string;

  tokensOwed1Usd: string;

  apr: string;

  stakedAt: string;

  stakedUsdValue: string;

  rewards: RewardModel[];

  dailyRewards: RewardModel[];
  
  bins: PoolBinModel[];

  bins40: PoolBinModel[];

  closed: boolean;

  totalDailyRewardsUsd: string;

  totalClaimedUsd: string;
}

