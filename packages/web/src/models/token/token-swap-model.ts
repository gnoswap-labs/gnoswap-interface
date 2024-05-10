import { SwapDirectionType } from "@common/values/data-constant";
import { TokenModel } from "./token-model";

export interface TokenSwapModel {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  type: SwapDirectionType;
}

export interface DataTokenInfo {
  tokenA: TokenModel | null;
  tokenAAmount: string;
  tokenABalance: string;
  tokenB: TokenModel | null;
  tokenBAmount: string;
  tokenBBalance: string;
  direction: SwapDirectionType;
  tokenAUSDStr: string;
  tokenBUSDStr: string;
  tokenADecimals?: number;
  tokenBDecimals?: number;
}
