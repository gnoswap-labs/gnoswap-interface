import { waitFor } from "@testing-library/react";
import { QueryClient, QueryObserver } from "@tanstack/react-query";

import { QUERY_KEY } from "@query/query-keys";
import { encryptId } from "@utils/common";

import { invalidateSwapPools } from "./use-swap-handler.utils";

const usedPool = "gno.land/r/demo/a:gno.land/r/demo/b:3000";
const otherFeePool = "gno.land/r/demo/a:gno.land/r/demo/b:500";

describe("invalidateSwapPools", () => {
  let client: QueryClient;

  beforeEach(() => {
    client = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: Infinity } } });
  });

  afterEach(() => client.clear());

  it("invalidates only routed pools, including chart variants and overlapping RPC batches", async () => {
    const usedKeys = [
      [QUERY_KEY.poolSqrtPriceX96, usedPool],
      [QUERY_KEY.poolLiquidity, usedPool],
      [QUERY_KEY.poolTicks, usedPool, false, -100, 100],
      [QUERY_KEY.poolLiquidityTicks, usedPool, "segments", 40],
      [QUERY_KEY.poolFromDb, encryptId(usedPool)],
      [QUERY_KEY.poolDetail, encryptId(usedPool)],
      [QUERY_KEY.prices, encryptId(usedPool), "1D"],
      [QUERY_KEY.rpcPools, [otherFeePool, usedPool]],
    ];
    const untouchedKeys = [
      [QUERY_KEY.poolSqrtPriceX96, otherFeePool],
      [QUERY_KEY.poolFromDb, encryptId(otherFeePool)],
      [QUERY_KEY.rpcPools, [otherFeePool]],
      [QUERY_KEY.pools],
      [QUERY_KEY.poolTickSpacing, usedPool],
      [QUERY_KEY.positions, "account"],
    ];
    [...usedKeys, ...untouchedKeys].forEach(key => client.setQueryData(key, "cached"));

    await invalidateSwapPools(client, [usedPool, usedPool]);

    usedKeys.forEach(key => expect(client.getQueryState(key)?.isInvalidated).toBe(true));
    untouchedKeys.forEach(key => expect(client.getQueryState(key)?.isInvalidated).toBe(false));
  });

  it("fetches the post-swap price on immediate mount instead of reusing a fresh pre-swap price", async () => {
    const queryKey = [QUERY_KEY.poolSqrtPriceX96, usedPool];
    client.setQueryData(queryKey, 100n);
    await invalidateSwapPools(client, [usedPool]);

    const observer = new QueryObserver(client, {
      queryKey,
      queryFn: async () => 121n,
      staleTime: 5_000,
    });
    const unsubscribe = observer.subscribe(() => {});
    try {
      await waitFor(() => expect(observer.getCurrentResult().data).toBe(121n));
      expect(client.getQueryData(queryKey)).toBe(121n);
    } finally {
      unsubscribe();
    }
  });

  it("refreshes an active DB projection again after indexing catches up", async () => {
    const queryKey = [QUERY_KEY.poolFromDb, encryptId(usedPool)];
    let indexedPrice = 1;
    client.setQueryData(queryKey, { price: indexedPrice });
    const observer = new QueryObserver(client, {
      queryKey,
      queryFn: async () => ({ price: indexedPrice }),
      staleTime: 5_000,
    });
    const unsubscribe = observer.subscribe(() => {});
    try {
      await invalidateSwapPools(client, [usedPool]);
      expect(observer.getCurrentResult().data?.price).toBe(1);
      indexedPrice = 1.21;
      await invalidateSwapPools(client, [usedPool]);
      expect(observer.getCurrentResult().data?.price).toBe(1.21);
    } finally {
      unsubscribe();
    }
  });
});
