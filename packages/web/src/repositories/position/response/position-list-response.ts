import { PoolBinModel } from "@models/pool/pool-bin-model";
import { RewardResponse } from "./reward-response";

export type PositionListResponse = PositionResponse[];

export interface PositionResponse {
  lpTokenId: string;

  poolPath: string;

  staked: boolean;

  operator: string;

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

  reward?: RewardResponse[];

  bins40: PoolBinModel[];

  closed: boolean;

  totalClaimedUsd: string;

  incentiveType: string;

  unclaimedFeeAUsd: string;

  unclaimedFeeBUsd: string;

  totalDailyRewardsUsd: string;

  stakedUsd?: string;

  tokenUri: string;
}
