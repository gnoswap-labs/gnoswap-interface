import { SwapDirectionType } from "@common/values";
import { SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { AmountModel } from "@models/common/amount-model";
import { TokenModel } from "@models/token/token-model";
import { makeDisplayTokenAmount } from "@utils/token-utils";

export interface SwapSummaryInfo {
  tokenA: TokenModel;

  tokenB: TokenModel;

  swapDirection: SwapDirectionType;

  swapRate: number;

  swapRateUSD: number;

  priceImpact: number;

  guaranteedAmount: AmountModel; // Apply slippage

  swapRateAction: SwapRateAction;

  swapRate1USD: number;

  /** Router fee rate shown beside the fee label, e.g. "0.15%". */
  protocolFee: string;

  /**
   * Router fee of this swap as the quote's raw `feeAmount`: an integer in raw units of the OUTPUT token
   * (`tokenB`) for both exact modes. `null` when the quote does not provide one.
   */
  routerFeeAmountRaw: string | null;

  /** USD price of one `tokenB`; `null` when it has none. */
  tokenBPriceUSD: number | null;
}

export function swapDirectionToGuaranteedType(swapDirection: SwapDirectionType) {
  if (swapDirection === "EXACT_IN") {
    return "Swap:swapInfo.minReceived";
  }
  return "Swap:swapInfo.maxSent";
}

export function getMinReceivedBy(swapSummaryInfo: SwapSummaryInfo) {
  const { swapDirection, guaranteedAmount } = swapSummaryInfo;
  if (swapDirection === "EXACT_OUT") {
    return "-";
  }
  return `${makeDisplayTokenAmount(swapSummaryInfo.tokenB, guaranteedAmount.amount)} ${guaranteedAmount.currency}`;
}
