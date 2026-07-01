import BigNumber from "bignumber.js";

import type { TokenModel } from "@models/token/token-model";
import { checkGnotPath } from "@utils/common";
import { makeRawPrice } from "@utils/pool-utils";
import { sortTokenPaths } from "@utils/sort-utils";
import { priceToNearTick, tickToPrice } from "@utils/swap-utils";

export const snapPoolAddRawStartingPrice = (rawPrice: number, tickSpacing: number): number | null => {
  if (BigNumber(rawPrice).isNaN() || !Number.isFinite(rawPrice) || rawPrice <= 0) {
    return null;
  }

  const tick = priceToNearTick(rawPrice, tickSpacing);
  return tickToPrice(tick);
};

const getPoolOrderPath = (token: TokenModel): string => {
  return token.wrappedPath || checkGnotPath(token.path) || token.path;
};

export const makePoolAddSortedRawPrice = (
  displayPrice: number,
  baseToken: TokenModel,
  quoteToken: TokenModel,
): number => {
  const rawPriceInInputOrder = makeRawPrice(displayPrice, baseToken, quoteToken);
  const [firstPath] = [getPoolOrderPath(baseToken), getPoolOrderPath(quoteToken)].sort(sortTokenPaths);

  if (firstPath === getPoolOrderPath(baseToken)) {
    return rawPriceInInputOrder;
  }

  return BigNumber(1).div(rawPriceInInputOrder).toNumber();
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

  const rawPrice = makePoolAddSortedRawPrice(priceNum, tokenA, tokenB);
  return snapPoolAddRawStartingPrice(rawPrice, tickSpacing);
};
