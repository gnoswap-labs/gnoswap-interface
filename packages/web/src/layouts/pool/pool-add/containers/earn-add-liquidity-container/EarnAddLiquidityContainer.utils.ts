import BigNumber from "bignumber.js";

import type { TokenModel } from "@models/token/token-model";
import { makeRawPrice } from "@utils/pool-utils";
import { priceToNearTick, tickToPrice } from "@utils/swap-utils";

export const snapPoolAddRawStartingPrice = (rawPrice: number, tickSpacing: number): number | null => {
  if (BigNumber(rawPrice).isNaN() || !Number.isFinite(rawPrice) || rawPrice <= 0) {
    return null;
  }

  const tick = priceToNearTick(rawPrice, tickSpacing);
  return tickToPrice(tick);
};

export const resolvePoolAddStartingPrice = (
  displayPrice: string,
  tokenA: TokenModel,
  tokenB: TokenModel,
  tickSpacing: number,
): number | null => {
  const priceNum = BigNumber(displayPrice).toNumber();
  if (BigNumber(priceNum).isNaN() || !Number.isFinite(priceNum) || priceNum <= 0) {
    return null;
  }

  const rawPrice = makeRawPrice(priceNum, tokenA, tokenB);
  return snapPoolAddRawStartingPrice(rawPrice, tickSpacing);
};
