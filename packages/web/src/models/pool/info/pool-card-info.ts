import { SwapFeeTierType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

/**
 * Todo: Change data structure
 */
export interface IncentivizePoolCardInfo {
  poolId: string;

  incentivized: boolean;

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

  poolPath?: string;

  tvl: string;
}
