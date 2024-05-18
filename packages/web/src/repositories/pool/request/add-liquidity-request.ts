import { SwapFeeTierType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface AddLiquidityRequest {
  tokenA: TokenModel;
  tokenB: TokenModel;
  feeTier: SwapFeeTierType;
  tokenAAmount: string;
  tokenBAmount: string;
  minTick: number;
  maxTick: number;
  slippage: number;
  caller: string;
  withStaking?: boolean;
}
