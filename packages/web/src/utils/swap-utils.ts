import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { MAX_TICK, MIN_TICK } from "@constants/swap.constant";
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

export function tickToPrice(tick: number) {
  const pow10001 = BigNumber(1.0001).pow(tick);
  return Number(BigNumber(pow10001).sqrt().toFixed(16));
}

export function priceToTick(price: number) {
  const logPrice = Math.log(price ** 2);
  const log10001 = Math.log(1.0001);
  return Math.round(BigNumber(logPrice).dividedBy(log10001).toNumber());
}

export function priceToNearTick(price: number, tickSpacing: number) {
  const tickRaw = priceToTick(price);
  const mod = Math.abs(tickRaw) % tickSpacing;
  const sign = Math.sign(tickRaw);

  if (sign < 0) {
    return tickRaw - (tickSpacing - mod);
  }
  return tickRaw - mod;
}

export function tickToPriceStr(tick: number, decimals?: number) {
  if (tick === MIN_TICK + 1) {
    return "0.00";
  }
  if (tick === MAX_TICK - 1) {
    return "∞";
  }
  const decimalsLimit = decimals || 4;
  const result = BigNumber(1.001 ** (tick / 2))
    .toFormat(decimalsLimit)
    .replace(/\.?0+$/, "");
  if (result === "0") {
    return "";
  }
  return result;
}
