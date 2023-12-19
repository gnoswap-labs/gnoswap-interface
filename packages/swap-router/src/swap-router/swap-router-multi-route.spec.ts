import { sumBigInts } from "../common/array.util";
import { makePoolsByRPC } from "../common/mapper";
import { SwapRouter } from "./swap-router";

const multiPairPools = makePoolsByRPC([
  {
    pool_path: "gno.land/r/bar:gno.land/r/baz:100",
    token0_path: "gno.land/r/bar",
    token1_path: "gno.land/r/baz",
    fee: 100,
    token0_balance: 4524,
    token1_balance: 4999,
    tick_spacing: 2,
    max_liquidity_per_tick: 20790381397506,
    sqrt_price_x96: 83290069058676223003182343270,
    tick: 999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 953659,
    ticks: [900, 1100],
    tick_bitmaps: {
      "1": 25108406941546723055343157692830665664409421777856138051584,
      "2": 274877906944,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 900,
        tick_upper: 1100,
        liquidity: 953659,
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
    token0_balance: 18096,
    token1_balance: 19999,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 83290069058676223003182343270,
    tick: 999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 1912086,
    ticks: [800, 1200],
    tick_bitmaps: { "0": 1329227995786124798723421689455050752 },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 800,
        tick_upper: 1200,
        liquidity: 1912086,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/bar:gno.land/r/qux:100",
    token0_path: "gno.land/r/bar",
    token1_path: "gno.land/r/qux",
    fee: 100,
    token0_balance: 36102,
    token1_balance: 99999,
    tick_spacing: 2,
    max_liquidity_per_tick: 20790381397506,
    sqrt_price_x96: 83707541341720862783442401480,
    tick: 1099,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 3833661,
    ticks: [600, 1300],
    tick_bitmaps: {
      "1": 17592186044416,
      "2": 348449143727040986586495598010130648530944,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 600,
        tick_upper: 1300,
        liquidity: 3833661,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/bar:gno.land/r/qux:500",
    token0_path: "gno.land/r/bar",
    token1_path: "gno.land/r/qux",
    fee: 500,
    token0_balance: 36102,
    token1_balance: 99999,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 83707541341720862783442401480,
    tick: 1099,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 3833661,
    ticks: [600, 1300],
    tick_bitmaps: { "0": 1361129467683753853854651351231679692800 },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 600,
        tick_upper: 1300,
        liquidity: 3833661,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/bar:gno.land/r/foo:100",
    token0_path: "gno.land/r/bar",
    token1_path: "gno.land/r/foo",
    fee: 100,
    token0_balance: 4999,
    token1_balance: 2182,
    tick_spacing: 2,
    max_liquidity_per_tick: 20790381397506,
    sqrt_price_x96: 82461360252420434748702387191,
    tick: 799,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 210785,
    ticks: [600, 1300],
    tick_bitmaps: {
      "1": 17592186044416,
      "2": 348449143727040986586495598010130648530944,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 600,
        tick_upper: 1300,
        liquidity: 210785,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/baz:gno.land/r/qux:100",
    token0_path: "gno.land/r/baz",
    token1_path: "gno.land/r/qux",
    fee: 100,
    token0_balance: 90484,
    token1_balance: 99999,
    tick_spacing: 2,
    max_liquidity_per_tick: 20790381397506,
    sqrt_price_x96: 83290069058676223003182343270,
    tick: 999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 9560434,
    ticks: [800, 1200],
    tick_bitmaps: {
      "1": 22300745198530623141535718272648361505980416,
      "2": 309485009821345068724781056,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 800,
        tick_upper: 1200,
        liquidity: 9560434,
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
    token0_balance: 90484,
    token1_balance: 99999,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 83290069058676223003182343270,
    tick: 999,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 9560434,
    ticks: [800, 1200],
    tick_bitmaps: { "0": 1329227995786124798723421689455050752 },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 800,
        tick_upper: 1200,
        liquidity: 9560434,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/baz:gno.land/r/foo:100",
    token0_path: "gno.land/r/baz",
    token1_path: "gno.land/r/foo",
    fee: 100,
    token0_balance: 59276,
    token1_balance: 99999,
    tick_spacing: 2,
    max_liquidity_per_tick: 20790381397506,
    sqrt_price_x96: 84127106108408273045668369098,
    tick: 1199,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 6325969,
    ticks: [900, 1400],
    tick_bitmaps: {
      "1": 25108406941546723055343157692830665664409421777856138051584,
      "2": 392318858461667547739736838950479151006397215279002157056,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 900,
        tick_upper: 1400,
        liquidity: 6325969,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/baz:gno.land/r/foo:500",
    token0_path: "gno.land/r/baz",
    token1_path: "gno.land/r/foo",
    fee: 500,
    token0_balance: 59276,
    token1_balance: 99999,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 84127106108408273045668369098,
    tick: 1199,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 6325969,
    ticks: [900, 1400],
    tick_bitmaps: { "0": 1393796574908165184286021677420797493248000 },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 900,
        tick_upper: 1400,
        liquidity: 6325969,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/foo:gno.land/r/qux:100",
    token0_path: "gno.land/r/foo",
    token1_path: "gno.land/r/qux",
    fee: 100,
    token0_balance: 38391,
    token1_balance: 99999,
    tick_spacing: 2,
    max_liquidity_per_tick: 20790381397506,
    sqrt_price_x96: 84127106108408273045668369098,
    tick: 1199,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 2738261,
    ticks: [500, 1500],
    tick_bitmaps: {
      "0": 1809251394333065553493296640760748560207343510400633813116524750123642650624,
      "2": 441711766194596082395824375185729628956870974218904739530401550323154944,
    },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 500,
        tick_upper: 1500,
        liquidity: 2738261,
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
    token0_balance: 38391,
    token1_balance: 99999,
    tick_spacing: 10,
    max_liquidity_per_tick: 103951672670308,
    sqrt_price_x96: 84127106108408273045668369098,
    tick: 1199,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 2738261,
    ticks: [500, 1500],
    tick_bitmaps: { "0": 1427247692705959881058285969450621036289589248 },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 500,
        tick_upper: 1500,
        liquidity: 2738261,
        token0_owed: 0,
        token1_owed: 0,
      },
    ],
  },
  {
    pool_path: "gno.land/r/foo:gno.land/r/qux:3000",
    token0_path: "gno.land/r/foo",
    token1_path: "gno.land/r/qux",
    fee: 3000,
    token0_balance: 44678,
    token1_balance: 99999,
    tick_spacing: 60,
    max_liquidity_per_tick: 623727610269131,
    sqrt_price_x96: 84127106108408273045668369098,
    tick: 1199,
    fee_protocol: 0,
    token0_protocol_fee: 0,
    token1_protocol_fee: 0,
    liquidity: 3186705,
    ticks: [600, 1500],
    tick_bitmaps: { "0": 33555456 },
    positions: [
      {
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tick_lower: 600,
        tick_upper: 1500,
        liquidity: 3186705,
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
        "gno.land/r/foo",
        100000n,
        "EXACT_IN",
      );

      const sumAmount = sumBigInts(
        estimatedRoutes.map(route => route.amountOut),
      );

      expect(estimatedRoutes).toHaveLength(2);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/qux:500*POOL*gno.land/r/baz:gno.land/r/qux:500*POOL*gno.land/r/baz:gno.land/r/foo:500",
      );
      expect(estimatedRoutes[0].quote).toBe(95);

      expect(estimatedRoutes[1].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/foo:100",
      );
      expect(estimatedRoutes[1].quote).toBe(5);

      expect(sumAmount).toBe(101601n);
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
        "gno.land/r/bar:gno.land/r/baz:500*POOL*gno.land/r/baz:gno.land/r/foo:500*POOL*gno.land/r/foo:gno.land/r/qux:500",
      );
      expect(estimatedRoutes[0].quote).toBe(100);
      expect(sumAmount).toBe(7192n);
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
      expect(estimatedRoutes).toHaveLength(2);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/qux:100",
      );
      expect(estimatedRoutes[0].quote).toBe(60);

      expect(estimatedRoutes[1].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/qux:500",
      );
      expect(estimatedRoutes[1].quote).toBe(40);

      expect(sumAmount).toBe(8944n);
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
        "gno.land/r/bar:gno.land/r/qux:100",
      );
      expect(estimatedRoutes[0].quote).toBe(55);
      expect(estimatedRoutes[1].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/qux:500",
      );
      expect(estimatedRoutes[1].quote).toBe(45);

      expect(sumAmount).toBe(11179n);
    });
  });
});
