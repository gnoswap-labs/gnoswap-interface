import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import useDebounce from "@hooks/common/use-debounce";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolBinModel } from "@models/pool/pool-bin-model";

import { QUERY_KEY } from "../query-keys";

// Delay between a pool-state change (tick / balances) being observed and the
// bins refetch firing. Gives the server time to (re)build the bins for the
// new state, so we don't fetch a payload that still reflects the old state.
const DEFAULT_DEBOUNCE_DELAY = 1_000;

export interface PoolBinsResult {
  bins: PoolBinModel[];
  // The currentTick captured at fetch time. Bins are server-centered on this
  // tick, so the graph must render this tick alongside these bins — never the
  // tick from another source/time, or the graph layout skews.
  pairedTick: number | null;
}

export const useGetBinsByPath = (
  path: string,
  count?: number,
  currentTick?: number | null,
  poolDepositedTokenAAmount?: number | null,
  poolDepositedTokenBAmount?: number | null,
  options?: UseQueryOptions<PoolBinsResult, Error>,
) => {
  const { poolRepository } = useGnoswapContext();
  const { queryKey: extraQueryKey, enabled: callerEnabled, ...restOptions } = options ?? {};

  // Debounce the pool-state inputs so a state change waits `refetchDelay`
  // before it can drive a refetch. Consecutive changes collapse to the last
  // value, and the server gets a window to reflect the change in its bins.
  const {
    currentTick: debouncedCurrentTick,
    poolDepositedTokenAAmount: debouncedTokenAAmount,
    poolDepositedTokenBAmount: debouncedTokenBAmount,
  } = useDebounce(
    {
      currentTick,
      poolDepositedTokenAAmount,
      poolDepositedTokenBAmount,
    },
    DEFAULT_DEBOUNCE_DELAY,
  );

  // Gate on the *debounced* tick, not the raw one: the query key is built from
  // debounced values, so enabling on the raw tick would let the first fetch go
  // out keyed on a stale (or undefined) tick before the debounce settles.
  const enabled = (callerEnabled ?? true) && debouncedCurrentTick !== undefined;

  return useQuery<PoolBinsResult, Error>({
    // Append the debounced pool-detail dependencies (currentTick / token
    // balances) to the caller-provided key so changed liquidity is the primary
    // trigger for a bins refetch — even if the caller overrides `queryKey`.
    // The pool-detail query already polls every 5s; the heavy bins payload is
    // only re-fetched when those values actually change (after the debounce),
    // so unchanged liquidity costs nothing. (Callers may still add a slow
    // `refetchInterval` as a safety net.)
    queryKey: [
      ...(extraQueryKey ?? [QUERY_KEY.bins, path]),
      count ?? null,
      debouncedCurrentTick ?? null,
      debouncedTokenAAmount ?? null,
      debouncedTokenBAmount ?? null,
    ],
    queryFn: async () => {
      const bins = await poolRepository.getBinsOfPoolByPath(path, count);
      // Pair the bins with the tick they were fetched for. keepPreviousData
      // then swaps both atomically, so the graph never mixes new bins with a
      // stale tick (or vice versa) mid-refetch.
      return { bins, pairedTick: debouncedCurrentTick ?? null };
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...restOptions,
    enabled,
  });
};
