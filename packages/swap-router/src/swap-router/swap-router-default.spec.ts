import { sumBigInts } from "../common/array.util";
import { Pool } from "../swap-simulator";
import { SwapRouter } from "./swap-router";

const defaultPool = [
  {
    poolPath: "gno.land/r/bar:gno.land/r/baz:500",
    tokenAPath: "gno.land/r/bar",
    tokenBPath: "gno.land/r/baz",
    fee: 500,
    tokenABalance: 9937690n,
    tokenBBalance: 10943746n,
    tickSpacing: 10,
    maxLiquidityPerTick: 103951672670308,
    price: 1.2904451607773892,
    sqrtPriceX96: 102239599540632204908365252323n,
    tick: 5099,
    feeProtocol: 0,
    tokenAProtocolFee: 0,
    tokenBProtocolFee: 0,
    liquidity: 291453167n,
    ticks: [4000, 6000, 5000],
    tickBitmaps: {
      "1":
        "28269553036454149273332760011908996998438272973151439048218347582187896832",
      "2": "309485009821345068724781056",
    },
    positions: [
      {
        liquidity: 144812895n,
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tickLower: 4000,
        tickUpper: 6000,
        tokenAOwed: 0n,
        tokenBOwed: 0n,
      },
      {
        liquidity: 146640272n,
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tickLower: 5000,
        tickUpper: 6000,
        tokenAOwed: 0n,
        tokenBOwed: 0n,
      },
    ],
  },
];

const pools: Pool[] = [
  {
    poolPath: "gno.land/r/bar:gno.land/r/wugnot:100",
    tokenAPath: "gno.land/r/bar",
    tokenBPath: "gno.land/r/wugnot",
    fee: 100,
    tokenABalance: 9853895n,
    tokenBBalance: 6166600n,
    tickSpacing: 2,
    maxLiquidityPerTick: 20790381397506,
    price: 0.779404257840941,
    sqrtPriceX96: 61750767583116102203745501184n,
    tick: -4985,
    feeProtocol: 134,
    tokenAProtocolFee: 0,
    tokenBProtocolFee: 1,
    liquidity: 159860277n,
    ticks: [-6000, -4000],
    tickBitmaps: { "-12": "4722366482869645213696", "-8": "281474976710656" },
    positions: [
      {
        liquidity: 159860277n,
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tickLower: -6000,
        tickUpper: -4000,
        tokenAOwed: 0n,
        tokenBOwed: 0n,
      },
    ],
  },
  {
    poolPath: "gno.land/r/bar:gno.land/r/baz:100",
    tokenAPath: "gno.land/r/bar",
    tokenBPath: "gno.land/r/baz",
    fee: 100,
    tokenABalance: 6334940n,
    tokenBBalance: 9556679n,
    tickSpacing: 2,
    maxLiquidityPerTick: 20790381397506,
    price: 1.2812333353136363,
    sqrtPriceX96: 101509763531262422762163011584n,
    tick: 4956,
    feeProtocol: 134,
    tokenAProtocolFee: 4,
    tokenBProtocolFee: 0,
    liquidity: 159696391n,
    ticks: [4000, 6000],
    tickBitmaps: {
      "11": "24519928653854221733733552434404946937899825954937634816",
      "7": "411376139330301510538742295639337626245683966408394965837152256",
    },
    positions: [
      {
        liquidity: 159696391n,
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tickLower: 4000,
        tickUpper: 6000,
        tokenAOwed: 0n,
        tokenBOwed: 0n,
      },
    ],
  },
  {
    poolPath: "gno.land/r/baz:gno.land/r/qux:100",
    tokenAPath: "gno.land/r/baz",
    tokenBPath: "gno.land/r/qux",
    fee: 100,
    tokenABalance: 6305554n,
    tokenBBalance: 9604960n,
    tickSpacing: 2,
    maxLiquidityPerTick: 20790381397506,
    price: 1.2815356657099168,
    sqrtPriceX96: 101533716613178802159080177664n,
    tick: 4961,
    feeProtocol: 134,
    tokenAProtocolFee: 4,
    tokenBProtocolFee: 0,
    liquidity: 159696391n,
    ticks: [4000, 6000],
    tickBitmaps: {
      "11": "24519928653854221733733552434404946937899825954937634816",
      "7": "411376139330301510538742295639337626245683966408394965837152256",
    },
    positions: [
      {
        liquidity: 159696391n,
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tickLower: 4000,
        tickUpper: 6000,
        tokenAOwed: 0n,
        tokenBOwed: 0n,
      },
    ],
  },
  {
    poolPath: "gno.land/r/bar:gno.land/r/qux:500",
    tokenAPath: "gno.land/r/bar",
    tokenBPath: "gno.land/r/qux",
    fee: 500,
    tokenABalance: 9780762n,
    tokenBBalance: 6211106n,
    tickSpacing: 10,
    maxLiquidityPerTick: 103951672670308,
    price: 0.7796822632585274,
    sqrtPriceX96: 61772793441655519457558134784n,
    tick: -4979,
    feeProtocol: 134,
    tokenAProtocolFee: 0,
    tokenBProtocolFee: 8,
    liquidity: 159860277n,
    ticks: [-6000, -4000],
    tickBitmaps: {
      "-2": "5192296858534827628530496329220096",
      "-3": "374144419156711147060143317175368453031918731001856",
    },
    positions: [
      {
        liquidity: 159860277n,
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tickLower: -6000,
        tickUpper: -4000,
        tokenAOwed: 0n,
        tokenBOwed: 0n,
      },
    ],
  },
  {
    poolPath: "gno.land/r/bar:gno.land/r/baz:500",
    tokenAPath: "gno.land/r/bar",
    tokenBPath: "gno.land/r/baz",
    fee: 500,
    tokenABalance: 6284695n,
    tokenBBalance: 9639363n,
    tickSpacing: 10,
    maxLiquidityPerTick: 103951672670308,
    price: 1.2817510932444631,
    sqrtPriceX96: 101550784541000520953925468160n,
    tick: 4964,
    feeProtocol: 134,
    tokenAProtocolFee: 18,
    tokenBProtocolFee: 0,
    liquidity: 159696391n,
    ticks: [4000, 6000],
    tickBitmaps: {
      "1": "22300745198530623141535718272648361505980416",
      "2": "309485009821345068724781056",
    },
    positions: [
      {
        liquidity: 159696391n,
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tickLower: 4000,
        tickUpper: 6000,
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
    tokenABalance: 6426094n,
    tokenBBalance: 9407440n,
    tickSpacing: 10,
    maxLiquidityPerTick: 103951672670308,
    price: 1.2802988187307696,
    sqrtPriceX96: 101435723499108871635082412032n,
    tick: 4941,
    feeProtocol: 134,
    tokenAProtocolFee: 30,
    tokenBProtocolFee: 0,
    liquidity: 159696391n,
    ticks: [4000, 6000],
    tickBitmaps: {
      "1": "22300745198530623141535718272648361505980416",
      "2": "309485009821345068724781056",
    },
    positions: [
      {
        liquidity: 159696391n,
        owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
        tickLower: 4000,
        tickUpper: 6000,
        tokenAOwed: 0n,
        tokenBOwed: 0n,
      },
    ],
  },
];

describe("swap router of swap simulator test pool", () => {
  describe("gno.land/r/bar to gno.land/r/baz", () => {
    test("EXANCT_IN 10000n", async () => {
      const swapRouter = new SwapRouter(defaultPool);
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
      expect(sumAmount).toBe(16643n);
    });

    test("EXANCT_OUT, 10000n", async () => {
      const swapRouter = new SwapRouter(defaultPool);
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
      expect(sumAmount).toBe(6008n);
    });

    describe("gno.land/r/baz to gno.land/r/bar", () => {
      test("EXANCT_IN, 10000n", async () => {
        const swapRouter = new SwapRouter(defaultPool);
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
        expect(sumAmount).toBe(6001n);
      });

      test("EXANCT_OUT, 10000n", async () => {
        const swapRouter = new SwapRouter(defaultPool);
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
        expect(sumAmount).toBe(16661n);
      });
    });
  });
});

describe("swap simulator", () => {
  describe("gno.land/r/bar to gno.land/r/baz", () => {
    test("EXANCT_IN 10000n", async () => {
      const swapRouter = new SwapRouter(pools);
      const estimatedRoutes = swapRouter.estimateSwapRoute(
        "gno.land/r/bar",
        "gno.land/r/baz",
        10000n,
        "EXACT_IN",
      );

      const sumAmount = sumBigInts(
        estimatedRoutes.map(route => route.amountOut),
      );
      expect(estimatedRoutes).toHaveLength(2);
      expect(estimatedRoutes[0].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/baz:500",
      );
      expect(estimatedRoutes[0].quote).toBe(95);
      expect(estimatedRoutes[1].routeKey).toBe(
        "gno.land/r/bar:gno.land/r/baz:100",
      );
      expect(estimatedRoutes[1].quote).toBe(5);
      expect(sumAmount).toBe(16417n);
    });

    test("EXANCT_OUT, 10000n", async () => {
      const swapRouter = new SwapRouter(pools);
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
        "gno.land/r/bar:gno.land/r/qux:500*POOL*gno.land/r/baz:gno.land/r/qux:100",
      );
      expect(estimatedRoutes[0].quote).toBe(100);
      expect(sumAmount).toBe(27036n);
    });

    describe("gno.land/r/baz to gno.land/r/bar", () => {
      test("EXANCT_IN, 10000n", async () => {
        const swapRouter = new SwapRouter(pools);
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
          "gno.land/r/baz:gno.land/r/qux:100*POOL*gno.land/r/bar:gno.land/r/qux:500",
        );
        expect(estimatedRoutes[0].quote).toBe(100);
        expect(sumAmount).toBe(26992n);
      });

      test("EXANCT_OUT, 10000n", async () => {
        const swapRouter = new SwapRouter(pools);
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
        expect(sumAmount).toBe(16438n);
      });
    });
  });
});
