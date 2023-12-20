import { TokenModel } from "@models/token/token-model";

export interface AddLiquidityResponse {
  code: number;
  hash: string;
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenAAmount: string;
  tokenBAmount: string;
}
