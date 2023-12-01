import { EstimatedRoute } from "@gnoswap-labs/swap-router";
import { makeRoutesQuery } from "./swap-route-utils";

const estimatedRoutes: EstimatedRoute[] = [
  {
    routeKey:
      "gno.land/r/bar:gno.land/r/baz:500*POOL*gno.land/r/baz:gno.land/r/qux:500",
    pools: [
      {
        poolPath: "gno.land/r/bar:gno.land/r/baz:500",
        tokenAPath: "gno.land/r/bar",
        tokenBPath: "gno.land/r/baz",
        fee: 500,
        tokenABalance: 49660n,
        tokenBBalance: 99999n,
        tickSpacing: 10,
        maxLiquidityPerTick: 103951672670308,
        price: 1.1912357939484004,
        sqrtPriceX96: 112428146980036105194050682880n,
        tick: 6999,
        feeProtocol: 0,
        tokenAProtocolFee: 0,
        tokenBProtocolFee: 0,
        liquidity: 740557n,
        ticks: [5000, 9000],
        tickBitmaps: {},
        positions: [
          {
            liquidity: 740557n,
            owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
            tickLower: 5000,
            tickUpper: 9000,
            tokenAOwed: 0n,
            tokenBOwed: 0n,
          },
        ],
      },
      {
        poolPath: "gno.land/r/baz:gno.land/r/qux:500",
        tokenAPath: "gno.land/r/baz",
        tokenBPath: "gno.land/r/qux",
        fee: 500,
        tokenABalance: 49660n,
        tokenBBalance: 99999n,
        tickSpacing: 10,
        maxLiquidityPerTick: 103951672670308,
        price: 1.1912357939484004,
        sqrtPriceX96: 112428146980036105194050682880n,
        tick: 6999,
        feeProtocol: 0,
        tokenAProtocolFee: 0,
        tokenBProtocolFee: 0,
        liquidity: 740557n,
        ticks: [5000, 9000],
        tickBitmaps: {},
        positions: [
          {
            liquidity: 740557n,
            owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
            tickLower: 5000,
            tickUpper: 9000,
            tokenAOwed: 0n,
            tokenBOwed: 0n,
          },
        ],
      },
    ],
    quote: 95,
    amountIn: 9500n,
    amountOut: 36480n,
  },
  {
    routeKey:
      "gno.land/r/bar:gno.land/r/foo:500*POOL*gno.land/r/foo:gno.land/r/qux:500",
    pools: [
      {
        poolPath: "gno.land/r/bar:gno.land/r/foo:500",
        tokenAPath: "gno.land/r/bar",
        tokenBPath: "gno.land/r/foo",
        fee: 500,
        tokenABalance: 1839n,
        tokenBBalance: 4999n,
        tickSpacing: 10,
        maxLiquidityPerTick: 103951672670308,
        price: 1.2840093675402746,
        sqrtPriceX96: 130621891405341616875390369792n,
        tick: 9999,
        feeProtocol: 0,
        tokenAProtocolFee: 0,
        tokenBProtocolFee: 0,
        liquidity: 31870n,
        ticks: [8000, 12000],
        tickBitmaps: {},
        positions: [
          {
            liquidity: 31870n,
            owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
            tickLower: 8000,
            tickUpper: 12000,
            tokenAOwed: 0n,
            tokenBOwed: 0n,
          },
        ],
      },
      {
        poolPath: "gno.land/r/foo:gno.land/r/qux:500",
        tokenAPath: "gno.land/r/foo",
        tokenBPath: "gno.land/r/qux",
        fee: 500,
        tokenABalance: 1839n,
        tokenBBalance: 4999n,
        tickSpacing: 10,
        maxLiquidityPerTick: 103951672670308,
        price: 1.2840093675402746,
        sqrtPriceX96: 130621891405341616875390369792n,
        tick: 9999,
        feeProtocol: 0,
        tokenAProtocolFee: 0,
        tokenBProtocolFee: 0,
        liquidity: 31870n,
        ticks: [8000, 12000],
        tickBitmaps: {},
        positions: [
          {
            liquidity: 31870n,
            owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
            tickLower: 8000,
            tickUpper: 12000,
            tokenAOwed: 0n,
            tokenBOwed: 0n,
          },
        ],
      },
    ],
    quote: 5,
    amountIn: 500n,
    amountOut: 3360n,
  },
];

describe("make swap route query", () => {
  test("2 routes and 2 pools", async () => {
    const routeKey = makeRoutesQuery(estimatedRoutes, "gno.land/r/bar");

    expect(routeKey).toBe(
      "gno.land/r/bar:gno.land/r/baz:500*POOL*gno.land/r/baz:gno.land/r/qux:500,gno.land/r/bar:gno.land/r/foo:500*POOL*gno.land/r/foo:gno.land/r/qux:500",
    );
  });
});
