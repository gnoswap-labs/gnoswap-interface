import { SwapDirectionType } from "@common/values";
import { TokenModel } from "@models/token/token-model";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";

export interface SwapTokenInfo {
  tokenA: TokenModel | null;

  tokenAAmount: string;

  tokenABalance: string;

  tokenAUSD: number | null;

  tokenAUSDStr: string;

  tokenAPriceGrade: TOKEN_PRICE_GRADE_TYPE;

  tokenB: TokenModel | null;

  tokenBAmount: string;

  tokenBBalance: string;

  tokenBUSD: number | null;

  tokenBUSDStr: string;

  tokenBPriceGrade: TOKEN_PRICE_GRADE_TYPE;

  direction: SwapDirectionType;

  slippage: number;

  tokenADecimals?: number;

  tokenBDecimals?: number;
}
