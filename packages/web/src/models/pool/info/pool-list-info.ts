import { SwapFeeTierType } from "@constants/option.constant";
import { RewardTokenModel } from "@models/position/reward-model";
import { TokenModel } from "@models/token/token-model";

export interface PoolListInfo {
  poolId: string;

  incentivized: boolean;

  tokenA: TokenModel;

  tokenB: TokenModel;

  feeTier: SwapFeeTierType;

  liquidity: string;

  apr: string;

  volume24h: string;

  fees24h: string;

  rewardTokens: RewardTokenModel[];

  price: number;

  currentTick: number;

  tvl: string;
}
