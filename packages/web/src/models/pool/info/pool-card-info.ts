import { SwapFeeTierType } from "@constants/option.constant";
import { RewardTokenModel } from "@models/position/reward-model";
import { TokenModel } from "@models/token/token-model";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";

/**
 * Todo: Change data structure
 */
export interface IncentivizePoolCardInfo {
  poolId: string;

  incentivized: boolean;

  hasStakedPosition: boolean;

  tokenA: TokenModel;

  tokenB: TokenModel;

  feeTier: SwapFeeTierType;

  liquidity: string;

  apr: string;

  stakingApr: string;

  volume24h: string;

  fees24h: string;

  rewardTokens: RewardTokenModel[];

  price: number;

  currentTick: number;

  poolPath?: string;

  tvl: string;
}

export interface IncentivizePoolCardInfoWithPriceGrade extends IncentivizePoolCardInfo {
  tokenAPriceGrade: TOKEN_PRICE_GRADE_TYPE;
  tokenBPriceGrade: TOKEN_PRICE_GRADE_TYPE;
}
