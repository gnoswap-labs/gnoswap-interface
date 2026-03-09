import { TokenModel } from "@models/token/token-model";

export interface DecreaseLiquidityRequest {
  lpTokenId: string;

  calculatedLiquidity: string;

  tokenA: TokenModel;

  tokenB: TokenModel;

  tokenAAmount: number;

  tokenBAmount: number;

  slippage: number;

  deadline?: string;

  caller: string;

  gasFee?: string;

  gasUsed?: string;
}
