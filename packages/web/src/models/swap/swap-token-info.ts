import { SwapDirectionType } from "@common/values";
import { TokenModel } from "@models/token/token-model";

export interface SwapTokenInfo {
  tokenA: TokenModel | null;

  tokenAAmount: string;

  tokenABalance: string;

  tokenAUSD: number;

  tokenB: TokenModel | null;

  tokenBAmount: string;

  tokenBBalance: string;

  tokenBUSD: number;

  direction: SwapDirectionType;

  slippage: number;
}
