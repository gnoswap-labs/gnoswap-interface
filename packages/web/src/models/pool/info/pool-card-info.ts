import { INCENTIVE_TYPE, SwapFeeTierType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import { PoolBinModel } from "../pool-bin-model";

/**
 * Todo: Change data structure
 */
export interface IncentivizePoolCardInfo {
  poolId: string;

  incentiveType: INCENTIVE_TYPE;

  tokenA: TokenModel;

  tokenB: TokenModel;

  feeTier: SwapFeeTierType;

  liquidity: string;

  apr: string;

  volume24h: string;

  fees24h: string;

  rewardTokens: TokenModel[];

  price: number;

  currentTick: number;

  bins40: PoolBinModel[];

  poolPath?: string;

  tvl: string;
}
