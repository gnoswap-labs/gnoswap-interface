import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { MAX_TICK, MIN_TICK, X96 } from "@constants/swap.constant";
import BigNumber from "bignumber.js";
import { tickToSqrtPriceX96 } from "@gnoswap-labs/swap-router";

const LOG10001 = Math.log(1.0001);

export function getCurrentPriceByRaw(raw: string) {
  return BigNumber(raw).dividedBy(X96).pow(2);
}

export function makeSwapFeeTier(value: string | number): SwapFeeTierType {
  for (const swapFeeTierInfo of Object.values(SwapFeeTierInfoMap)) {
    if (swapFeeTierInfo.fee === Number(value)) {
      return swapFeeTierInfo.type;
    }
  }
  return "NONE";
}

export function generate() {
  const gap = 5000;
  const start = 885000;
  const count = start / gap;

  const a: any = {};

  const PRICE5000 = "1.6486800559311757";
  const PRICEM5000 = "0.6065458221578347";

  console.log("genereate");
  for (let i = 1; i < count + 1; i++) {
    const price = BigNumber(PRICE5000).pow(i);
    const mPrice = BigNumber(PRICEM5000).pow(i);
    a[`${i * gap}`] = {
      price: price.toNumber(),
      sqrtPriceX96: price.sqrt().multipliedBy(X96).toFixed(0),
    };
    a[`${i * gap * -1}`] = {
      price: mPrice.toNumber(),
      sqrtPriceX96: mPrice.sqrt().multipliedBy(X96).toFixed(0),
    };
  }
  console.log(a);
}

export function tickToPrice(tick: number) {
  const sqrtPriceX96 = tickToSqrtPriceX96(tick);
  return rawBySqrtX96(sqrtPriceX96);
}

export function priceToTick(price: number) {
  if (price === 0) {
    return MIN_TICK;
  }
  const logPrice = Math.log(price ** 2);
  return Math.round(BigNumber(logPrice).dividedBy(LOG10001).toNumber());
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

  const nearTick = (tickAbs - mod) * sign;
  if (sign > 0) {
    return nearTick;
  }

  const minTick = maxTick * -1;
  return nearTick - tickSpacing > minTick ? nearTick - tickSpacing : minTick;
}

export function rawBySqrtX96(value: number | bigint | string) {
  return BigNumber(value.toString()).dividedBy(X96).toNumber();
}

export function priceX96ToNearTick(priceX96: number, tickSpacing: number) {
  const price = rawBySqrtX96(priceX96);
  return priceToNearTick(price, tickSpacing);
}

export function tickToPriceStr(tick: number, decimals?: number) {
  if (tick === MIN_TICK + 1) {
    return "0.00";
  }
  if (tick === MAX_TICK - 1) {
    return "∞";
  }
  const decimalsLimit = decimals || 4;
  const result = BigNumber(tickToPrice(tick))
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
    .squareRoot();
  return BigNumber(1)
    .dividedBy(1 - sqrt4Value.toNumber())
    .toFixed(2);
}

export function sqrtPriceX96ToTick(priceX96: number | BigInt) {
  const price = getCurrentPriceByRaw(priceX96.toString());
  return priceToTick(price.toNumber());
}
