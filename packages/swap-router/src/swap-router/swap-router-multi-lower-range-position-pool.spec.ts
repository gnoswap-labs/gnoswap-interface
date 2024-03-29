import { printEstimateRouteInfo } from "../common";
import { sumBigInts } from "../common/array.util";
import { makePoolsByRPC } from "../common/mapper";
import { SwapRouter } from "./swap-router";

const multiPositionPools = makePoolsByRPC([
  {
    pool_path: "gno.land/r/bar:gno.land/r/baz:500",
    token0_path: "gno.land/r/bar",
    token1_path: "gno.land/r/baz",
    fee: 500,
    token0_balance: 2943,
    token1_balance: 10007998,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 130621891405341611593710811006,
    tick: 9999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 50992,
    ticks: [8000, 12000, 6000],
    tick_bitmaps: {
      "2": 309485009821345068724781056,
      "3": 4294967296,
      "4": 95780971304118053647396689196894323976171195136475136,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 8000,
        tick_upper: 12000,
        liquidity: 50992,
        token0_owed: 0,
        token1_owed: 0,
      },
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 6000,
        tick_upper: 8000,
        liquidity: 70444213,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
]);

describe("swap router of lower range positions pool", () => {
  describe("gno.land/r/bar to gno.land/r/baz", () => {
    test("EXANCT_IN, 10000", async () => {
      const swapRouter = new SwapRouter(multiPositionPools);
      const estimatedRoutes = swapRouter.estimateSwapRoute(
        "gno.land/r/bar",
        "gno.land/r/baz",
        10000n,
        "EXACT_IN",
      );

      const sumAmount = sumBigInts(
        estimatedRoutes.map(route => route.amountOut),
      );
      expect(estimatedRoutes).toHaveLength(1);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/baz:500",
      );
      expect(estimatedRoutes[0].quote).toBe(100);

      expect(sumAmount).toBe(20535n);
    });

    test("EXACT_OUT, 10000", async () => {
      const swapRouter = new SwapRouter(multiPositionPools);
      const estimatedRoutes = swapRouter.estimateSwapRoute(
        "gno.land/r/bar",
        "gno.land/r/baz",
        10000n,
        "EXACT_OUT",
      );

      const sumAmount = sumBigInts(
        estimatedRoutes.map(route => route.amountOut),
      );
      expect(estimatedRoutes).toHaveLength(1);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/baz:500",
      );
      expect(estimatedRoutes[0].quote).toBe(100);
      expect(sumAmount).toBe(4176n);
    });
  });

  describe("gno.land/r/baz to gno.land/r/bar", () => {
    test("EXANCT_IN, 10000", async () => {
      const swapRouter = new SwapRouter(multiPositionPools);
      const estimatedRoutes = swapRouter.estimateSwapRoute(
        "gno.land/r/baz",
        "gno.land/r/bar",
        10000n,
        "EXACT_IN",
      );

      const sumAmount = sumBigInts(
        estimatedRoutes.map(route => route.amountOut),
      );
      expect(estimatedRoutes).toHaveLength(1);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/baz:500",
      );
      expect(estimatedRoutes[0].quote).toBe(100);
      expect(sumAmount).toBe(2943n);
    });

    test("EXACT_OUT, 10000", async () => {
      const swapRouter = new SwapRouter(multiPositionPools);
      const estimatedRoutes = swapRouter.estimateSwapRoute(
        "gno.land/r/baz",
        "gno.land/r/bar",
        10000n,
        "EXACT_OUT",
      );

      const sumAmount = sumBigInts(
        estimatedRoutes.map(route => route.amountOut),
      );
      expect(estimatedRoutes).toHaveLength(1);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/baz:500",
      );
      expect(estimatedRoutes[0].quote).toBe(100);
      expect(sumAmount).toBe(8843n);
    });
  });
});
