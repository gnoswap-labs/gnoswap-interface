import { useMemo } from "react";

import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import useDebounce from "@hooks/common/use-debounce";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { PositionBinModel } from "@models/position/position-bin-model";

// Delay between a pool-state change (tick / balances / liquidity) being
// observed and the bins refetch firing. Gives the server time to (re)build the
// bins for the new state, so we don't fetch a payload that still reflects the
// old state. Mirrors `useGetBinsByPath`.
const DEFAULT_DEBOUNCE_DELAY = 1_000;

// Pool-state inputs that the server-built position bins depend on. A
// `PositionBinModel` carries `poolLiquidity` / `poolReserveToken*` and each bin
// is drawn as the position's share of the pool, so the bins go stale whenever
// the *pool* changes — not just when this position's own liquidity does. Any
// liquidity event in the pool (even from another address) shifts these values.
interface PoolStateInput {
  // This position's own liquidity — changes on add / remove / reposition.
  liquidity?: bigint | null;
  // Pool-wide state, read from `position.pool`. The pool-detail / positions
  // queries poll, so these update on their own and drive the refetch.
  poolCurrentTick?: number | null;
  poolTokenABalance?: number | null;
  poolTokenBBalance?: number | null;
}

export const useGetPositionBins = (
  lpTokenId: string,
  count: 20 | 40,
  poolState?: PoolStateInput,
  options?: UseQueryOptions<PositionBinModel[], Error>,
) => {
  const { positionRepository } = useGnoswapContext();

  const { liquidity, poolCurrentTick, poolTokenABalance, poolTokenBBalance } = poolState ?? {};

  // Memoize the pool-state input object before handing it to `useDebounce`.
  // `useDebounce` would otherwise re-arm its timer on every render for a fresh
  // object literal. Key the memo on the primitives (`liquidity` stringified,
  // since bigint isn't a stable dep otherwise).
  const poolStateInput = useMemo(
    () => ({
      liquidity: liquidity?.toString() ?? null,
      poolCurrentTick: poolCurrentTick ?? null,
      poolTokenABalance: poolTokenABalance ?? null,
      poolTokenBBalance: poolTokenBBalance ?? null,
    }),
    [liquidity, poolCurrentTick, poolTokenABalance, poolTokenBBalance],
  );

  // Debounce the pool-state inputs so consecutive changes collapse to the last
  // value and the server gets a window to reflect the change in its bins.
  const {
    liquidity: debouncedLiquidity,
    poolCurrentTick: debouncedTick,
    poolTokenABalance: debouncedTokenABalance,
    poolTokenBBalance: debouncedTokenBBalance,
  } = useDebounce(poolStateInput, DEFAULT_DEBOUNCE_DELAY);

  return useQuery<PositionBinModel[], Error>({
    // Append the debounced pool-state dependencies to the key so changed
    // liquidity — this position's or anyone else's in the pool — is the trigger
    // for a bins refetch. Mirrors how `useGetBinsByPath` keys pool bins.
    queryKey: [
      QUERY_KEY.positionBins,
      lpTokenId,
      count,
      debouncedLiquidity,
      debouncedTick,
      debouncedTokenABalance,
      debouncedTokenBBalance,
    ],
    queryFn: async () => {
      const data = await positionRepository.getPositionBins(lpTokenId, count);
      return data;
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
