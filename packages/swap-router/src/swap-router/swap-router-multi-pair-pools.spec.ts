import { sumBigInts } from "../common/array.util";
import { makePoolsByRPC } from "../common/mapper";
import { SwapRouter } from "./swap-router";

const multiPairPools = makePoolsByRPC([
  {
    pool_path: "gno.land/r/bar:gno.land/r/baz:500",
    token0_path: "gno.land/r/bar",
    token1_path: "gno.land/r/baz",
    fee: 500,
    token0_balance: 49660,
    token1_balance: 99999,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 112428146980036109168897402316,
    tick: 6999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 740557,
    ticks: [5000, 9000],
    tick_bitmaps: {
      "1": 28269553036454149273332760011886696253239742350009903329945699220681916416,
      "3": 5444517870735015415413993718908291383296,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 5000,
        tick_upper: 9000,
        liquidity: 740557,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/baz:gno.land/r/qux:500",
    token0_path: "gno.land/r/baz",
    token1_path: "gno.land/r/qux",
    fee: 500,
    token0_balance: 49660,
    token1_balance: 99999,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 112428146980036109168897402316,
    tick: 6999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 740557,
    ticks: [5000, 9000],
    tick_bitmaps: {
      "1": 28269553036454149273332760011886696253239742350009903329945699220681916416,
      "3": 5444517870735015415413993718908291383296,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 5000,
        tick_upper: 9000,
        liquidity: 740557,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/bar:gno.land/r/foo:500",
    token0_path: "gno.land/r/bar",
    token1_path: "gno.land/r/foo",
    fee: 500,
    token0_balance: 1839,
    token1_balance: 4999,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 130621891405341611593710811006,
    tick: 9999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 31870,
    ticks: [8000, 12000],
    tick_bitmaps: {
      "3": 4294967296,
      "4": 95780971304118053647396689196894323976171195136475136,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 8000,
        tick_upper: 12000,
        liquidity: 31870,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/foo:gno.land/r/qux:500",
    token0_path: "gno.land/r/foo",
    token1_path: "gno.land/r/qux",
    fee: 500,
    token0_balance: 1839,
    token1_balance: 4999,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 130621891405341611593710811006,
    tick: 9999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 31870,
    ticks: [8000, 12000],
    tick_bitmaps: {
      "3": 4294967296,
      "4": 95780971304118053647396689196894323976171195136475136,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 8000,
        tick_upper: 12000,
        liquidity: 31870,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
]);

describe("swap router of multi pair pools", () => {
  describe("gno.land/r/bar to gno.land/r/qux", () => {
    test("EXANCT_IN, 100000", async () => {
      const swapRouter = new SwapRouter(multiPairPools);
      const estimatedRoutes = swapRouter.estimateSwapRoute(
        "gno.land/r/bar",
        "gno.land/r/qux",
        10000n,
        "EXACT_IN",
      );

      const sumAmount = sumBigInts(
        estimatedRoutes.map(route => route.amountOut),
      );
      expect(estimatedRoutes).toHaveLength(2);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/baz:500*POOL*gno.land/r/baz:gno.land/r/qux:500",
      );
      expect(estimatedRoutes[0].quote).toBe(95);

      expect(estimatedRoutes[1].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/foo:500*POOL*gno.land/r/foo:gno.land/r/qux:500",
      );
      expect(estimatedRoutes[1].quote).toBe(5);

      expect(sumAmount).toBe(39840n);
    });

    test("EXACT_OUT, 100000", async () => {
      const swapRouter = new SwapRouter(multiPairPools);
      const estimatedRoutes = swapRouter.estimateSwapRoute(
        "gno.land/r/bar",
        "gno.land/r/qux",
        10000n,
        "EXACT_OUT",
      );

      const sumAmount = sumBigInts(
        estimatedRoutes.map(route => route.amountOut),
      );
      expect(estimatedRoutes).toHaveLength(1);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/baz:500*POOL*gno.land/r/baz:gno.land/r/qux:500",
      );
      expect(estimatedRoutes[0].quote).toBe(100);
      expect(sumAmount).toBe(2503n);
    });
  });

  describe("gno.land/r/qux to gno.land/r/bar", () => {
    test("EXANCT_IN, 100000", async () => {
      const swapRouter = new SwapRouter(multiPairPools);
      const estimatedRoutes = swapRouter.estimateSwapRoute(
        "gno.land/r/qux",
        "gno.land/r/bar",
        10000n,
        "EXACT_IN",
      );

      const sumAmount = sumBigInts(
        estimatedRoutes.map(route => route.amountOut),
      );
      expect(estimatedRoutes).toHaveLength(1);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/baz:gno.land/r/qux:500*POOL*gno.land/r/bar:gno.land/r/baz:500",
      );
      expect(estimatedRoutes[0].quote).toBe(100);
      expect(sumAmount).toBe(2428n);
    });

    test("EXACT_OUT, 100000", async () => {
      const swapRouter = new SwapRouter(multiPairPools);
      const estimatedRoutes = swapRouter.estimateSwapRoute(
        "gno.land/r/qux",
        "gno.land/r/bar",
        10000n,
        "EXACT_OUT",
      );

      const sumAmount = sumBigInts(
        estimatedRoutes.map(route => route.amountOut),
      );
      expect(estimatedRoutes).toHaveLength(2);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/baz:gno.land/r/qux:500*POOL*gno.land/r/bar:gno.land/r/baz:500",
      );
      expect(estimatedRoutes[0].quote).toBe(95);

      expect(estimatedRoutes[1].routeKey).toBe(
        "gno.land/r/foo:gno.land/r/qux:500*POOL*gno.land/r/bar:gno.land/r/foo:500",
      );
      expect(estimatedRoutes[1].quote).toBe(5);
      expect(sumAmount).toBe(44878n);
    });
  });
});
