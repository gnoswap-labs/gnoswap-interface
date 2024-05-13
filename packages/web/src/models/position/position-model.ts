import { RewardModel } from "./reward-model";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { INCENTIVE_TYPE } from "@constants/option.constant";

export interface PositionModel {
  id: string;

  lpTokenId: string;

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

  apr: string;

  stakedAt: string;

  reward: RewardModel[];

  bins40: PoolBinModel[];

  closed: boolean;

  totalClaimedUsd: string;

  usdValue: any;

  incentiveType: INCENTIVE_TYPE;

  // TODO: Remove later
  // dailyRewards: RewardModel[];

  // bins: PoolBinModel[];

  totalDailyRewardsUsd: string;

  // unclaimedFee0Usd: string;

  // unclaimedFee1Usd: string;

  // tokensOwed0Amount: bigint;

  // tokensOwed1Amount: bigint;

  // tokensOwed0Usd: string;

  // tokensOwed1Usd: string;

  stakedUsdValue: string;
}

