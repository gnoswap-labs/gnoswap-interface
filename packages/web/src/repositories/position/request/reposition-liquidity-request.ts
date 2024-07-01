import { TokenModel } from "@models/token/token-model";

export interface RepositionLiquidityRequest {
  lpTokenId: string;

  tokenA: TokenModel;

  tokenB: TokenModel;

  tokenAAmount: string;

  tokenBAmount: string;

  minTick: number;

  maxTick: number;

  slippage: number;

  caller: string;

  withStaking?: boolean;
}
