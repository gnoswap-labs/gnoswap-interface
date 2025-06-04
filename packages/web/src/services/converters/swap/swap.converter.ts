import { AmountConverter } from "../common/amount";

import { SwapHistoryItem } from "@repositories/swap/response/swap-history-response";

/**
 * Utility class responsible for converting swap history amounts
 * Convert raw token amounts in swap history to display format using AmountConverter
 */
export class SwapConverter {
  /**
   * Convert raw token amounts in swap history items to display format
   * Processes both fromToken and toToken amounts using their respective decimals
   */
  static convertSwapHistory(items: SwapHistoryItem[] | null | undefined): SwapHistoryItem[] {
    if (!items || !Array.isArray(items)) return [];

    return [...items].map((item: SwapHistoryItem) => {
      return {
        ...item,
        toTokenAmount: AmountConverter.convertSingle(item.toToken, item.toTokenAmount),
        fromTokenAmount: AmountConverter.convertSingle(item.fromToken, item.fromTokenAmount),
      };
    });
  }
}
