import { TokenModel } from "@models/token/token-model";

export interface DecreaseLiquidityRequest {
  lpTokenId: string;

  tokenA: TokenModel;

  tokenB: TokenModel;

  decreaseRatio: number;

  deadline?: string;

  caller: string;

  existWrappedToken: boolean;
}
