import { TokenModel } from "@models/token/token-model";

export interface FindBestPoolReqeust {
  tokenA: TokenModel;

  tokenB: TokenModel;

  zeroForOne: boolean; // direction

  amountSpecified: number; // positive: token to spend, negative: token to receive
}
