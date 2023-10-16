import { SwapDirectionType } from "@common/values";
import { AmountModel } from "@models/common/amount-model";
import { TokenModel } from "@models/token/token-model";
import { toNumberFormat } from "@utils/number-utils";

export interface SwapSummaryInfo {
  tokenA: TokenModel;

  tokenB: TokenModel;

  swapDirection: SwapDirectionType;

  swapRate: number;

  swapRateUSD: number;

  priceImpact: number;

  guaranteedAmount: AmountModel; // Apply slippage

  gasFee: AmountModel;

  gasFeeUSD: number;
}

export function swapDirectionToGuaranteedType(
  swapDirection: SwapDirectionType,
) {
  if (swapDirection === "EXACT_IN") {
    return "Min. Received";
  }
  return "Max. Sent";
}

export function getMinReceivedBy(swapSummaryInfo: SwapSummaryInfo) {
  const { swapDirection, guaranteedAmount } = swapSummaryInfo;
  if (swapDirection === "EXACT_OUT") {
    return "-";
  }
  return `${toNumberFormat(guaranteedAmount.amount)} ${
    guaranteedAmount.currency
  }`;
}
