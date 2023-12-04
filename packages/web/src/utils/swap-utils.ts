import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { MAX_TICK, MIN_TICK, Q96 } from "@constants/swap.constant";
import BigNumber from "bignumber.js";
import { tickToSqrtPriceX96 } from "./math.utils";

const LOG10001 = Math.log(1.0001);

export function makeSwapFeeTier(value: string | number): SwapFeeTierType {
  for (const swapFeeTierInfo of Object.values(SwapFeeTierInfoMap)) {
    if (swapFeeTierInfo.fee === Number(value)) {
      return swapFeeTierInfo.type;
    }
  }
  return "NONE";
}

export function priceToTick(price: number | bigint) {
  if (price === 0) {
    return MIN_TICK;
  }
  const logPrice = 2 * Math.log(Number(price));
  return Math.round(BigNumber(logPrice).dividedBy(LOG10001).toNumber());
}

export function priceToNearTick(price: number | bigint, tickSpacing: number) {
  const tickRaw = priceToTick(price);
  const tickAbs = Math.abs(tickRaw);
  const mod = tickAbs % tickSpacing;
  const sign = Math.sign(tickRaw);

  if (mod === 0) {
    return tickAbs * sign;
  }

  const maxTick = MAX_TICK - (MAX_TICK % tickSpacing);
  if (tickAbs > maxTick) {
    return maxTick * sign;
  }

  const nearTick = (tickAbs - mod) * sign;
  if (sign > 0) {
    return nearTick;
  }

  const minTick = maxTick * -1;
  return nearTick - tickSpacing > minTick ? nearTick - tickSpacing : minTick;
}

export function rawBySqrtX96(value: number | bigint | string) {
  return BigNumber(value.toString())
    .dividedBy(Q96.toString())
    .pow(2)
    .toNumber();
}

export function priceX96ToNearTick(
  priceX96: number | bigint,
  tickSpacing: number,
) {
  const price = rawBySqrtX96(priceX96);
  return priceToNearTick(price, tickSpacing);
}

export function tickToPrice(tick: number) {
  const sqrtPriceX96 = tickToSqrtPriceX96(tick);
  return rawBySqrtX96(sqrtPriceX96);
}

export function tickToPriceStr(tick: number, decimals?: number) {
  if (tick === MIN_TICK + 1) {
    return "0.00";
  }
  if (tick === MAX_TICK - 1) {
    return "∞";
  }
  const decimalsLimit = decimals || 4;
  const result = BigNumber(tickToPrice(tick).toString())
    .toFormat(decimalsLimit)
    .replace(/\.?0+$/, "");
  if (result === "0") {
    return "";
  }
  return result;
}

export function feeBoostRateByPrices(
  minPrice: number | null,
  maxPrice: number | null,
) {
  if (minPrice === null || maxPrice === null || minPrice > maxPrice) {
    return null;
  }
  const sqrt4Value = BigNumber(minPrice / maxPrice)
    .squareRoot()
    .squareRoot()
    .abs();
  return BigNumber(1)
    .dividedBy(1 - sqrt4Value.toNumber())
    .toFixed(2);
}

export function sqrtPriceX96ToTick(priceX96: number | BigInt) {
  const price = rawBySqrtX96(priceX96.toString());
  return priceToTick(price);
}
