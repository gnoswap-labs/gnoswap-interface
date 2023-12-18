import { IncentivizedOptions } from "@common/values";
import { RewardModel } from "./reward-model";

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

  token0Balance: bigint;

  token1Balance: bigint;

  positionUsdValue: string;

  unclaimedFee0Amount: bigint;

  unclaimedFee1Amount: bigint;

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
}
