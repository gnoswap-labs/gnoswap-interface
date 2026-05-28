import { QUERY_KEY } from "@query/query-keys";
import { PoolLiquidityTickModel } from "@models/pool/pool-liquidity-model";

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: jest.fn(),
}));

import {
  createGetLiquidityTicksByPathQueryKey,
  createGetLiquidityTicksByPathQueryOptions,
} from "./use-get-liquidity-ticks-by-path";

describe("createGetLiquidityTicksByPathQueryKey", () => {
  it("uses a ticks-specific key that cannot collide with pool bins keys", () => {
    const poolPath = "pool-1";

    expect(createGetLiquidityTicksByPathQueryKey(poolPath)).toEqual([QUERY_KEY.poolLiquidityTicks, poolPath]);
    expect(createGetLiquidityTicksByPathQueryKey(poolPath)).not.toEqual([QUERY_KEY.bins, poolPath]);
    expect(createGetLiquidityTicksByPathQueryKey(poolPath)).not.toEqual([QUERY_KEY.lazyBins, poolPath]);
  });
});

describe("createGetLiquidityTicksByPathQueryOptions", () => {
  it("keeps custom query keys under the poolLiquidityTicks prefix so mutation invalidation catches them", () => {
    const poolRepository = {
      getLiquidityTicksOfPoolByPath: jest.fn<Promise<PoolLiquidityTickModel[]>, [string]>(),
    };

    const options = createGetLiquidityTicksByPathQueryOptions(poolRepository, "pool-1", {
      queryKey: ["useSelectPool/liquiditySegments", "pool-1", 40],
    });

    expect(options.queryKey).toEqual([
      QUERY_KEY.poolLiquidityTicks,
      "pool-1",
      "useSelectPool/liquiditySegments",
      "pool-1",
      40,
    ]);
  });

  it("maps the repository ticks result without coercing liquidityNet strings", async () => {
    const liquidityNet = "340282366920938463463374607431768211456";
    const ticks: PoolLiquidityTickModel[] = [{ tick: 1, liquidityNet }];
    const poolRepository = {
      getLiquidityTicksOfPoolByPath: jest.fn<Promise<PoolLiquidityTickModel[]>, [string]>().mockResolvedValue(ticks),
    };

    const options = createGetLiquidityTicksByPathQueryOptions(poolRepository, "pool-1");
    const result = await options.queryFn();

    expect(poolRepository.getLiquidityTicksOfPoolByPath).toHaveBeenCalledWith("pool-1");
    expect(result).toEqual([{ tick: 1, liquidityNet }]);
    expect(typeof result[0].liquidityNet).toBe("string");
  });
});
