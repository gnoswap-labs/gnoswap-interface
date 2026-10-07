import { useMemo } from "react";
import { UseQueryOptions } from "@tanstack/react-query";

import {
  PoolLiquiditySegmentBuildOptions,
  PoolLiquiditySegmentModel,
  PoolLiquidityTickModel,
} from "@models/pool/pool-liquidity-model";
import { useGetLiquidityTicksByPath } from "@query/pools";
import { getPoolLiquiditySegmentMemoByPath } from "@utils/pool-liquidity-segment-cache";

type LiquidityTickQueryOptions = Omit<UseQueryOptions<PoolLiquidityTickModel[], Error>, "queryFn" | "queryKey"> & {
  enabled?: boolean;
  queryKey?: readonly unknown[];
};

export const usePoolLiquiditySegmentsByPath = (
  poolPath: string | null | undefined,
  segmentOptions?: PoolLiquiditySegmentBuildOptions,
  queryOptions?: LiquidityTickQueryOptions,
): {
  liquiditySegments: PoolLiquiditySegmentModel[];
  isLoading: boolean;
  isFetched: boolean;
  isError: boolean;
} => {
  const { data: liquidityTicks = [], isLoading, isFetched, isError } = useGetLiquidityTicksByPath(poolPath, queryOptions);
  const memoizedTransform = useMemo(() => getPoolLiquiditySegmentMemoByPath(poolPath), [poolPath]);
  const currentTick = segmentOptions?.currentTick;
  const currentSqrtPriceX96 = segmentOptions?.currentSqrtPriceX96;
  const currentPrice = segmentOptions?.currentPrice;
  const tokenA = segmentOptions?.tokenA;
  const tokenB = segmentOptions?.tokenB;
  const displayTokenAPath = segmentOptions?.displayTokenAPath;
  const displayTokenBPath = segmentOptions?.displayTokenBPath;
  const includeTokenAmounts = segmentOptions?.includeTokenAmounts;
  const visibleTickRange = segmentOptions?.visibleTickRange;
  const binCount = segmentOptions?.binCount;

  const stableSegmentOptions = useMemo(
    () => ({
      currentTick,
      currentSqrtPriceX96,
      currentPrice,
      tokenA,
      tokenB,
      displayTokenAPath,
      displayTokenBPath,
      includeTokenAmounts,
      visibleTickRange,
      binCount,
    }),
    [
      currentTick,
      currentSqrtPriceX96,
      currentPrice,
      tokenA,
      tokenB,
      displayTokenAPath,
      displayTokenBPath,
      includeTokenAmounts,
      visibleTickRange,
      binCount,
    ],
  );

  const liquiditySegments = useMemo(
    () => memoizedTransform(liquidityTicks, stableSegmentOptions),
    [memoizedTransform, liquidityTicks, stableSegmentOptions],
  );

  return {
    liquiditySegments,
    isLoading,
    isFetched,
    isError,
  };
};
