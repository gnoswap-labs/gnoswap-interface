import { ClaimedRewardModel } from "@models/position/reward-model";
import { RewardResponse } from "./reward-response";

export interface PositionListResponse {
  positions: PositionResponse[];
  totalCount: number;
}

export interface PositionResponse {
  lpTokenId: string;

  poolPath: string;

  staked: boolean;

  owner: string;

  tickLower: string;

  tickUpper: string;

  liquidity: string;

  tokenABalance: string;

  tokenBBalance: string;

  usdValue: string;

  unclaimedFeeAAmount: string;

  unclaimedFeeBAmount: string;

  apr?: number;

  stakedAt?: string;

  rewards?: RewardResponse[];

  claimedRewards?: ClaimedRewardModel[];

  closed: boolean;

  totalClaimedUsd: string;

  unclaimedFeeAUsd: string;

  unclaimedFeeBUsd: string;

  totalDailyRewardsUsd: string;

  stakedUsd?: string;

  tokenUri: string;
}
