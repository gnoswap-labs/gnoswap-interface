import { SwapFeeTierType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface AddLiquidityRequest {
  tokenA: TokenModel;
  tokenB: TokenModel;
  feeTier: SwapFeeTierType;
  tokenAAmount: string;
  tokenBAmount: string;
  minTick: number;
  maxTick: number;
  slippage: number;
  caller: string;
  referrerAddress: string | null;
  gasFee?: string;
  gasUsed?: string;
}

/** An add-liquidity request without the gas figures, which only the send path needs. */
export type AddLiquidityMessagesRequest = Omit<AddLiquidityRequest, "gasFee" | "gasUsed">;
