import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import BigNumber from "bignumber.js";

export function getCurrentPriceByRaw(raw: string) {
  return BigNumber(raw).dividedBy(2 ** 96);
}

export function makeSwapFeeTier(value: string | number): SwapFeeTierType {
  for (const swapFeeTierInfo of Object.values(SwapFeeTierInfoMap)) {
    if (swapFeeTierInfo.fee === Number(value)) {
      return swapFeeTierInfo.type;
    }
  }
  return "NONE";
}
