import { SwapFeeTierType } from "@constants/option.constant";
import { RewardTokenModel } from "@models/position/reward-model";
import { TokenModel } from "@models/token/token-model";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";

export interface PoolListInfo {
  poolId: string;

  incentivized: boolean;

  tokenA: TokenModel;

  tokenAPriceGrade: TOKEN_PRICE_GRADE_TYPE;

  tokenB: TokenModel;

  tokenBPriceGrade: TOKEN_PRICE_GRADE_TYPE;

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
