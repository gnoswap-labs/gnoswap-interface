import { SwapFeeRateMap, SwapFeeTierType } from "@constants/option.constant";
import BigNumber from "bignumber.js";

export function getCurrentPriceByRaw(raw: string) {
  return BigNumber(raw).dividedBy(2 ** 96);
}

export function makeSwapFeeTier(value: string | number): SwapFeeTierType {
  const feeStr = `${value}`;
  if (SwapFeeRateMap.FEE_100.toString() === feeStr) {
    return "FEE_100";
  }
  if (SwapFeeRateMap.FEE_500.toString() === feeStr) {
    return "FEE_500";
  }
  if (SwapFeeRateMap.FEE_3000.toString() === feeStr) {
    return "FEE_3000";
  }
  if (SwapFeeRateMap.FEE_10000.toString() === feeStr) {
    return "FEE_10000";
  }
  return "NONE";
}
