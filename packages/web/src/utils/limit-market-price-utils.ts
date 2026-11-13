import { LimitMarketPricePair } from "@repositories/order/request";
import { checkGnotPath } from "@utils/common";

const normalizePath = (path: string) => checkGnotPath(path);

export const getLimitMarketPricePairKey = ({ tokenIn, tokenOut }: LimitMarketPricePair): string =>
  JSON.stringify([normalizePath(tokenIn), normalizePath(tokenOut)]);

export const canonicalizeLimitMarketPricePairs = (pairs: readonly LimitMarketPricePair[]): LimitMarketPricePair[] => {
  const uniquePairs = new Map<string, LimitMarketPricePair>();

  pairs.forEach(({ tokenIn, tokenOut }) => {
    const normalizedPair = { tokenIn: normalizePath(tokenIn), tokenOut: normalizePath(tokenOut) };
    if (!normalizedPair.tokenIn || !normalizedPair.tokenOut || normalizedPair.tokenIn === normalizedPair.tokenOut) {
      return;
    }
    uniquePairs.set(getLimitMarketPricePairKey(normalizedPair), normalizedPair);
  });

  return [...uniquePairs.values()].sort((a, b) => {
    if (a.tokenIn !== b.tokenIn) return a.tokenIn < b.tokenIn ? -1 : 1;
    if (a.tokenOut !== b.tokenOut) return a.tokenOut < b.tokenOut ? -1 : 1;
    return 0;
  });
};
