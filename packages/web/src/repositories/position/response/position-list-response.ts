import { PoolBinModel } from "@models/pool/pool-bin-model";
import { RewardResponse } from "./reward-response";

export type PositionListResponse = PositionResponse[];

export interface PositionResponse {
  lpTokenId: string;

  poolPath: string;

  staked: boolean;

  incentivized: boolean;

  operator: string;

  tickLower: string;

  tickUpper: string;

  liquidity: string;

  tokenABalance: string;

  tokenBBalance: string;

  positionUsdValue: string;

  unclaimedFeeAAmount: string;

  unclaimedFeeBAmount: string;

  unclaimedFee0Usd: string;

  unclaimedFee1Usd: string;

  tokensOwed0Amount: string;

  tokensOwed1Amount: string;

  tokensOwed0Usd: string;

  tokensOwed1Usd: string;

  apr?: number;

  stakedAt?: string;

  stakedUsdValue?: string;

  rewards?: RewardResponse[];

  dailyRewards?: RewardResponse[];
  bins: PoolBinModel[];
}
