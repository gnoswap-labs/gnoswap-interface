import { TokenModel } from "@models/token/token-model";

export interface AddLiquiditySuccessResponse {
  hash: string;
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenAAmount: string;
  tokenBAmount: string;
}

export interface AddLiquidityFailedResponse {
  hash: string;
}