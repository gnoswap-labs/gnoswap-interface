import BigNumber from "bignumber.js";

import { TokenModel } from "@models/token/token-model";
import { OnchainToken } from "@repositories/activity/responses/activity-responses";

/**
 * Utility class responsible for converting token amounts
 * Convert raw amount into a form that can be displayed to the user
 */
export class AmountConverter {
  /**
   * Convert raw amount of a single token to display amount
   *
   * @param token - token information (TokenModel or OnchainToken)
   * @param rawAmount - the raw amount to convert (string or number)
   * @returns converted amount string (‘0’ if conversion fails)
   *
   * @example
   * // 1000000 (6 decimals) of USDC tokens -> ‘1’
   * AmountConverter.convertSingle(usdcToken, "1000000") // "1"
   *
   * // GNOT 토큰의 10000000 (6 decimals) -> "10"
   * AmountConverter.convertSingle(GNOT, "10000000") // "10"
   */
  static convertSingle(token: TokenModel | OnchainToken, rawAmount: string | number): string {
    if (!token || rawAmount == null) return "0";

    try {
      const amount = new BigNumber(rawAmount);

      if (!amount.isFinite()) {
        return "0";
      }

      const rawDecimals = token.decimals;
      const normalizedDecimals = Number.isFinite(rawDecimals) ? Math.abs(Math.floor(rawDecimals)) : 0;

      const divisor = new BigNumber(10).pow(normalizedDecimals);
      const result = amount.dividedBy(divisor);

      return result.toFixed();
    } catch (error) {
      console.warn("AmountConverter: Failed to convert token amount", {
        tokenSymbol: token?.symbol,
        rawAmount,
        decimals: token?.decimals,
        error: error instanceof Error ? error.message : error,
      });
      return "0";
    }
  }
}
