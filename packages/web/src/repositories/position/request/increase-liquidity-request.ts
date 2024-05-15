import { TokenModel } from "@models/token/token-model";

export interface IncreaseLiquidityRequest {
  lpTokenId: string;

  tokenA: TokenModel;

  tokenB: TokenModel;

  tokenAAmount: number;

  tokenBAmount: number;

  caller: string;

  deadline?: string;
}
