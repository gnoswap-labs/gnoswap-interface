import { TokenModel } from "@models/token/token-model";

export interface SwapRequest {
  tokenA: TokenModel;

  tokenB: TokenModel;

  fee: number;

  receiver: string; //address

  zeroForOne: boolean; // direction

  amountSpecified: number; // positive: token to spend, negative: token to receive
}
