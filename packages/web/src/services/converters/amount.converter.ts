import { TokenModel } from "@models/token/token-model";
import { OnchainToken } from "@repositories/activity/responses/activity-responses";

import { makeDisplayTokenAmount } from "@utils/token-utils";

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

    if (typeof rawAmount === "number" && !isFinite(rawAmount)) {
      return "0"; // Infinity, -Infinity, NaN processing
    }

    return String(makeDisplayTokenAmount(token, rawAmount) ?? 0);
  }
}
