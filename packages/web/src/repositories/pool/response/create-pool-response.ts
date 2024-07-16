import { TokenModel } from "@models/token/token-model";

export interface CreatePoolSuccessResponse {
  hash: string;
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenAAmount: string;
  tokenBAmount: string;
}

export interface CreatePoolFailedResponse {
  hash: string
}