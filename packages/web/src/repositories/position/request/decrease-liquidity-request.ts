import { TokenModel } from "@models/token/token-model";

export interface DecreaseLiquidityRequest {
  lpTokenId: string;

  decreaseRatio: number;

  tokenA: TokenModel;

  tokenB: TokenModel;

  tokenAAmount: number;

  tokenBAmount: number;

  slippage: number;

  deadline?: string;

  caller: string;

  isGetWGNOT: boolean;
}
