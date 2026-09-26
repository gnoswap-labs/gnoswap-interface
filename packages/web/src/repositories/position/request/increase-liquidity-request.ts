import { TokenModel } from "@models/token/token-model";

export interface IncreaseLiquidityRequest {
  lpTokenId: string;

  tokenA: TokenModel;

  tokenB: TokenModel;

  tokenAAmount: number;

  tokenBAmount: number;

  caller: string;

  slippage: number;

  deadline?: string;

  gasFee?: string;

  gasUsed?: string;
}

/** An increase request without the gas figures, which only the send path needs. */
export type IncreaseLiquidityMessagesRequest = Omit<IncreaseLiquidityRequest, "gasFee" | "gasUsed">;
