import { SwapDirectionType } from "@common/values";
import { TokenModel } from "@models/token/token-model";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";

/**
 * A selected token and its values.
 * An unselected token is represented by a null side.
 */
export interface SwapTokenSide {
  token: TokenModel;
  amount: string;
  balance: string;
  /**
   * Zero also indicates an unavailable valuation.
   * usdStr preserves the display placeholder.
   */
  usd: number;
  usdStr: string;
  priceGrade: TOKEN_PRICE_GRADE_TYPE;
  decimals: number;
}

/** 
 * Swap token values and execution settings with null sides
 * for unselected tokens.
 */
export interface SwapTokenInfo {
  tokenA: SwapTokenSide | null;
  tokenB: SwapTokenSide | null;
  direction: SwapDirectionType;
  slippage: number;
}
