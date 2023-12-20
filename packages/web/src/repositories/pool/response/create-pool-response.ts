import { TokenModel } from "@models/token/token-model";

export interface CreatePoolResponse {
  code: number;
  hash: string;
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenAAmount: string;
  tokenBAmount: string;
}
