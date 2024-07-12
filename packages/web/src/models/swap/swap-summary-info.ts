import { SwapDirectionType } from "@common/values";
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

  gasFee: AmountModel;

  gasFeeUSD: number;

  swapRateAction: "ATOB" | "BTOA";

  swapRate1USD: number;

  protocolFee: string;
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
  return `${makeDisplayTokenAmount(
    swapSummaryInfo.tokenB,
    guaranteedAmount.amount,
  )} ${guaranteedAmount.currency}`;
}
