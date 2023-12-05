import { SwapDirectionType } from "@common/values";
import { TokenModel } from "@models/token/token-model";

export interface SwapTokenInfo {
  tokenA: TokenModel | null;

  tokenAAmount: string;

  tokenABalance: string;

  tokenAUSD: number;

  tokenAUSDStr: string;

  tokenB: TokenModel | null;

  tokenBAmount: string;

  tokenBBalance: string;

  tokenBUSD: number;

  tokenBUSDStr: string;

  direction: SwapDirectionType;

  slippage: string;
}
