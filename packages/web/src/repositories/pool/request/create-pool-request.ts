import { SwapFeeTierType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface CreatePoolRequest {
  tokenA: TokenModel;
  tokenB: TokenModel;
  feeTier: SwapFeeTierType;
  tokenAAmount: string;
  tokenBAmount: string;
  startPrice: string;
  minTick: number;
  maxTick: number;
  slippage: string;
  caller: string;
  withStaking?: boolean;
  createPoolFee: number; // fee is Raw Amount
}
