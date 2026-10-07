import { BuildPoolLiquiditySegmentsFn } from "@models/pool/pool-liquidity-model";

import { createPoolLiquiditySegmentMemo } from "./pool-liquidity-utils";

const segmentMemoByPoolPath = new Map<string, BuildPoolLiquiditySegmentsFn>();

export const getPoolLiquiditySegmentMemoByPath = (poolPath: string | null | undefined) => {
  const cacheKey = poolPath || "__empty_pool_path__";
  const cachedMemo = segmentMemoByPoolPath.get(cacheKey);
  if (cachedMemo) {
    return cachedMemo;
  }

  const memo = createPoolLiquiditySegmentMemo();
  segmentMemoByPoolPath.set(cacheKey, memo);
  return memo;
};

export const clearPoolLiquiditySegmentMemoCache = () => {
  segmentMemoByPoolPath.clear();
};
