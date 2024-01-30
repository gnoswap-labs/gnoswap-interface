import {
  SwapFeeTierInfoMap,
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { MAX_TICK, MIN_TICK, Q96 } from "@constants/swap.constant";
import BigNumber from "bignumber.js";
import { tickToSqrtPriceX96 } from "./math.utils";
import { convertToKMB } from "./stake-position-utils";

const LOG10001 = Math.log(1.0001);

export function makeSwapFeeTier(value: string | number): SwapFeeTierType {
  for (const swapFeeTierInfo of Object.values(SwapFeeTierInfoMap)) {
    if (swapFeeTierInfo.fee === Number(value)) {
      return swapFeeTierInfo.type;
    }
  }
  return "NONE";
}

export function makeSwapFeeTierByTickSpacing(
  tickSpacing: number,
): SwapFeeTierType {
  for (const swapFeeTierInfo of Object.values(SwapFeeTierInfoMap)) {
    if (swapFeeTierInfo.tickSpacing == tickSpacing) {
      return swapFeeTierInfo.type;
    }
  }
  return "NONE";
}

export function priceToTick(price: number | bigint) {
  const logPrice = Math.log(Number(price));
  return Math.round(BigNumber(logPrice).dividedBy(LOG10001).toNumber());
}

export function findNearPrice(price: number, tickSpacing: number) {
  const feeTier = makeSwapFeeTierByTickSpacing(tickSpacing);
  const { minPrice, maxPrice } = SwapFeeTierMaxPriceRangeMap[feeTier];
  let currentPrice = price;
  if (currentPrice <= minPrice) {
    currentPrice = minPrice;
  } else if (currentPrice >= maxPrice) {
    currentPrice = maxPrice;
  }

  const tickRaw = priceToTick(currentPrice);
  const tickAbs = Math.abs(tickRaw);
  const mod = tickAbs % tickSpacing;
  const sign = Math.sign(tickRaw);

  const previouTickAbs = tickAbs - mod;
  const nextTickAbs = tickAbs - mod + tickSpacing;
  const previousPrice = tickToPrice(previouTickAbs * sign);
  const nextPrice = tickToPrice(nextTickAbs * sign);

  if (
    Math.abs(previousPrice - currentPrice) > Math.abs(nextPrice - currentPrice)
  ) {
    return nextPrice;
  }
  return previousPrice;
}

export function priceToNearTick(price: number, tickSpacing: number) {
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

  const nearTickAmount = sign > 0 ? tickAbs - mod : tickAbs - mod - tickSpacing;
  const nearTick =
    mod > tickSpacing / 2
      ? (nearTickAmount + tickSpacing) * sign
      : nearTickAmount * sign;
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

export function tickToPriceStr(
  tick: number,
  decimals?: number,
  isEnd?: boolean,
) {
  if (isEnd) {
    return tick < 0 ? "0.00" : "∞";
  }
  const decimalsLimit = decimals || 4;
  const result = BigNumber(tickToPrice(tick).toString())
    .toFormat(decimalsLimit)
    .replace(/\.?0+$/, "");
  if (result === "0") {
    return "0";
  }
  return convertToKMB(result.replace(/,/g, ""));
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

/**
 * This function checks to determine if it is the end tick of the range.
 *
 * @param tick
 * @param fee
 * @returns
 */
export function isEndTickBy(tick: number, fee: string): boolean {
  const feeTier = makeSwapFeeTier(fee);
  const priceRangeMap = SwapFeeTierMaxPriceRangeMap[feeTier];
  if (!priceRangeMap) {
    return tick === MAX_TICK || tick === MIN_TICK;
  }
  const { maxTick, minTick } = priceRangeMap;
  return tick === maxTick || tick === minTick;
}
