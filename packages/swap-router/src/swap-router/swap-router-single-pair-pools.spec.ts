import { printEstimateRouteInfo } from "../common";
import { sumBigInts } from "../common/array.util";
import { makePoolsByRPC } from "../common/mapper";
import { SwapRouter } from "./swap-router";

const singlePairPools = makePoolsByRPC([
  {
    pool_path: "gno.land/r/bar:gno.land/r/baz:500",
    token0_path: "gno.land/r/bar",
    token1_path: "gno.land/r/baz",
    fee: 500,
    token0_balance: 3678978,
    token1_balance: 9999999,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 130621891405341611593710811006,
    tick: 9999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 63740878,
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
        liquidity: 63740878,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
]);

const singlePairMultiPools = makePoolsByRPC([
  {
    pool_path: "gno.land/r/bar:gno.land/r/baz:100",
    token0_path: "gno.land/r/bar",
    token1_path: "gno.land/r/baz",
    fee: 100,
    token0_balance: 74082,
    token1_balance: 99999,
    tick_spacing: 2,
    max_liquidity_per_tick: 20790381397506,
    sqrt_price_x96: 92049301871182272007977902845,
    tick: 2999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 1764909,
    ticks: [2000, 4000],
    tick_bitmaps: {
      "3": 6901746346790563787434755862277025452451108972170386555162524223799296,
      "7": 411376139330301510538742295639337626245683966408394965837152256,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 2000,
        tick_upper: 4000,
        liquidity: 1764909,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/bar:gno.land/r/baz:500",
    token0_path: "gno.land/r/bar",
    token1_path: "gno.land/r/baz",
    fee: 500,
    token0_balance: 6040,
    token1_balance: 9999,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 101739875811602769657756143944,
    tick: 5001,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 159369,
    ticks: [4000, 6000],
    tick_bitmaps: {
      "1": 22300745198530623141535718272648361505980416,
      "2": 309485009821345068724781056,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 4000,
        tick_upper: 6000,
        liquidity: 159369,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/bar:gno.land/r/baz:3000",
    token0_path: "gno.land/r/bar",
    token1_path: "gno.land/r/baz",
    fee: 3000,
    token0_balance: 10,
    token1_balance: 999,
    tick_spacing: 60,
    max_liquidity_per_tick: 623727610269131,
    sqrt_price_x96: 112428146980036109168897402316,
    tick: 6999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 14449,
    ticks: [6000, 7020],
    tick_bitmaps: { "0": 166154767123714712342377379238248448 },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 6000,
        tick_upper: 7020,
        liquidity: 14449,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
]);

describe("swap router of single pair pool", () => {
  describe("gno.land/r/bar to gno.land/r/baz", () => {
    test("EXANCT_IN, 100000", async () => {
      const swapRouter = new SwapRouter(singlePairPools);
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
      expect(sumAmount).toBe(27160n);
    });

    test("EXACT_OUT, 100000", async () => {
      const swapRouter = new SwapRouter(singlePairPools);
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
      expect(sumAmount).toBe(3680n);
    });
  });

  describe("gno.land/r/baz to gno.land/r/bar", () => {
    test("EXANCT_IN, 100000", async () => {
      const swapRouter = new SwapRouter(singlePairPools);
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
      expect(sumAmount).toBe(3676n);
    });

    test("EXACT_OUT, 100000", async () => {
      const swapRouter = new SwapRouter(singlePairPools);
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
      expect(sumAmount).toBe(27201n);
    });
  });
});

describe("swap router of single pair multi pools", () => {
  describe("gno.land/r/bar to gno.land/r/baz", () => {
    test("EXANCT_IN, 100000", async () => {
      const swapRouter = new SwapRouter(singlePairMultiPools);
      const estimatedRoutes = swapRouter.estimateSwapRoute(
        "gno.land/r/bar",
        "gno.land/r/baz",
        10000n,
        "EXACT_IN",
      );

      const sumAmount = sumBigInts(
        estimatedRoutes.map(route => route.amountOut),
      );
      expect(estimatedRoutes).toHaveLength(3);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/baz:500",
      );
      expect(estimatedRoutes[0].quote).toBe(60);

      expect(estimatedRoutes[1].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/baz:100",
      );
      expect(estimatedRoutes[1].quote).toBe(35);

      expect(estimatedRoutes[2].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/baz:3000",
      );
      expect(estimatedRoutes[2].quote).toBe(5);
      expect(sumAmount).toBe(15101n);
    });

    test("EXACT_OUT, 100000", async () => {
      const swapRouter = new SwapRouter(singlePairMultiPools);
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
        "gno.land/r/bar:gno.land/r/baz:3000",
      );
      expect(estimatedRoutes[0].quote).toBe(100);
      expect(sumAmount).toBe(523n);
    });
  });

  describe("gno.land/r/baz to gno.land/r/bar", () => {
    test("EXANCT_IN, 100000", async () => {
      const swapRouter = new SwapRouter(singlePairMultiPools);
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
        "gno.land/r/bar:gno.land/r/baz:100",
      );
      expect(estimatedRoutes[0].quote).toBe(100);
      expect(sumAmount).toBe(7371n);
    });

    test("EXACT_OUT, 100000", async () => {
      const swapRouter = new SwapRouter(singlePairMultiPools);
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
        "gno.land/r/bar:gno.land/r/baz:3000",
      );
      expect(estimatedRoutes[0].quote).toBe(100);
      expect(sumAmount).toBe(20n);
    });
  });
});
