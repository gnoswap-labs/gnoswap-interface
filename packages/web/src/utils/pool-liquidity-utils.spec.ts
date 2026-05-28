import { LIQUIDITY_GRAPH_BIN_COUNT, LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES } from "@constants/graph.constant";
import { MAX_TICK, MIN_TICK } from "@constants/swap.constant";
import { TokenModel } from "@models/token/token-model";
import {
  PoolLiquiditySegmentBuildOptions,
  PoolLiquiditySegmentModel,
  PoolLiquidityTickModel,
} from "@models/pool/pool-liquidity-model";
import { getAmountsForLiquidity } from "./liquidity-utils";
import { tickToSqrtPriceX96 } from "./math.utils";
import {
  buildPoolLiquiditySegments,
  createPoolLiquiditySegmentMemo,
  derivePoolLiquidityTokenAmounts,
} from "./pool-liquidity-utils";

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void): void;
declare function expect(actual: unknown): {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toBeLessThanOrEqual(expected: number): void;
  toBeGreaterThan(expected: number): void;
};

const makeToken = (symbol: string, decimals: number, pathSuffix = symbol.toLowerCase()): TokenModel => ({
  path: `gno.land/r/demo/${pathSuffix}`,
  tokenId: `gno.land/r/demo/${pathSuffix}.${symbol}`,
  type: "GRC20",
  chainId: "test-chain",
  name: symbol,
  symbol,
  displaySymbol: symbol,
  decimals,
  logoURI: "",
  createdAt: "",
  priceID: symbol,
});

const segment = (
  minTick: number,
  maxTick: number,
  liquidity: string,
  overrides: Partial<PoolLiquiditySegmentModel> = {},
): PoolLiquiditySegmentModel => ({
  minTick,
  maxTick,
  amountMinTick: minTick,
  amountMaxTick: maxTick,
  displayMinTick: minTick,
  displayMaxTick: maxTick,
  liquidity,
  graphHeightRatio: "1",
  currentTickRelation: "outside-below",
  isDisplayInverted: false,
  ...overrides,
});

const hugeLiquidity = "340282366920938463463374607431768211456";

describe("buildPoolLiquiditySegments", () => {
  it("returns an empty segment list when the pool has no initialized ticks", () => {
    expect(buildPoolLiquiditySegments([], { currentTick: 0 })).toEqual([]);
  });

  it("sorts unsorted pool tick deltas before producing full-range active-liquidity segments", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: 20, liquidityNet: "-100" },
      { tick: 0, liquidityNet: "100" },
      { tick: 30, liquidityNet: "-50" },
      { tick: 10, liquidityNet: "50" },
    ];

    expect(buildPoolLiquiditySegments(ticks, { currentTick: 15 })).toEqual([
      segment(0, 10, "100", { currentTickRelation: "outside-below", graphHeightRatio: "0.666666666666666667" }),
      segment(10, 20, "150", { currentTickRelation: "inside", graphHeightRatio: "1" }),
      segment(20, 30, "50", { currentTickRelation: "outside-above", graphHeightRatio: "0.333333333333333333" }),
    ]);
  });

  it("keeps liquidity as a string-safe BigInt value for amounts above Number.MAX_SAFE_INTEGER", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: -100, liquidityNet: hugeLiquidity },
      { tick: 100, liquidityNet: `-${hugeLiquidity}` },
    ];

    const expected = buildPoolLiquiditySegments(ticks, { currentTick: 0 });

    expect(expected).toEqual([segment(-100, 100, hugeLiquidity, { currentTickRelation: "inside" })]);
    expect(BigInt(expected[0].liquidity)).toBe(BigInt(hugeLiquidity));
  });

  it("accumulates negative deltas across overlapping liquidity ranges without going through Number", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: 0, liquidityNet: "1000" },
      { tick: 10, liquidityNet: "250" },
      { tick: 20, liquidityNet: "-1000" },
      { tick: 30, liquidityNet: "-250" },
    ];

    expect(buildPoolLiquiditySegments(ticks, { currentTick: 25 })).toEqual([
      segment(0, 10, "1000", { currentTickRelation: "outside-below", graphHeightRatio: "0.8" }),
      segment(10, 20, "1250", { currentTickRelation: "outside-below", graphHeightRatio: "1" }),
      segment(20, 30, "250", { currentTickRelation: "inside", graphHeightRatio: "0.2" }),
    ]);
  });

  it("folds same-tick canceling deltas and leaves zero-liquidity gaps out of the drawable buckets", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: 0, liquidityNet: "100" },
      { tick: 10, liquidityNet: "-100" },
      { tick: 30, liquidityNet: "200" },
      { tick: 30, liquidityNet: "-200" },
      { tick: 40, liquidityNet: "50" },
      { tick: 50, liquidityNet: "-50" },
    ];

    expect(buildPoolLiquiditySegments(ticks, { currentTick: 35 })).toEqual([
      segment(0, 10, "100", { currentTickRelation: "outside-below" }),
      segment(40, 50, "50", { currentTickRelation: "outside-above", graphHeightRatio: "0.5" }),
    ]);
  });

  it("marks the current tick relation for inside, outside, and boundary cases", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: 0, liquidityNet: "100" },
      { tick: 10, liquidityNet: "-100" },
    ];

    expect(buildPoolLiquiditySegments(ticks, { currentTick: -1 })[0].currentTickRelation).toBe("outside-below");
    expect(buildPoolLiquiditySegments(ticks, { currentTick: 0 })[0].currentTickRelation).toBe("at-lower-boundary");
    expect(buildPoolLiquiditySegments(ticks, { currentTick: 5 })[0].currentTickRelation).toBe("inside");
    expect(buildPoolLiquiditySegments(ticks, { currentTick: 10 })[0].currentTickRelation).toBe("at-upper-boundary");
    expect(buildPoolLiquiditySegments(ticks, { currentTick: 11 })[0].currentTickRelation).toBe("outside-above");
  });

  it("preserves raw pool tick accumulation while inverting display bounds for reversed token display inputs", () => {
    const tokenA = makeToken("GNS", 6, "gns");
    const tokenB = makeToken("WUGNOT", 6, "wugnot");
    const ticks: PoolLiquidityTickModel[] = [
      { tick: -20, liquidityNet: "100" },
      { tick: 10, liquidityNet: "-100" },
    ];

    expect(
      buildPoolLiquiditySegments(ticks, {
        currentTick: 0,
        tokenA,
        tokenB,
        displayTokenAPath: tokenB.path,
        displayTokenBPath: tokenA.path,
      }),
    ).toEqual([
      segment(-20, 10, "100", {
        displayMinTick: -10,
        displayMaxTick: 20,
        currentTickRelation: "inside",
        isDisplayInverted: true,
      }),
    ]);
  });

  it("normalizes graph heights with token decimals instead of raw uToken magnitudes", () => {
    const tokenA = makeToken("USDC", 6, "usdc");
    const tokenB = makeToken("GNOT", 18, "gnot");
    const ticks: PoolLiquidityTickModel[] = [
      { tick: 0, liquidityNet: "1000000" },
      { tick: 10, liquidityNet: "999999999999000000" },
      { tick: 20, liquidityNet: "-1000000000000000000" },
    ];

    expect(buildPoolLiquiditySegments(ticks, { currentTick: 5, tokenA, tokenB, includeTokenAmounts: true })).toEqual([
      segment(0, 10, "1000000", {
        currentTickRelation: "inside",
        graphHeightRatio: "0.000000000000998549",
        tokenAAmount: { rawAmount: "249", displayAmount: "0.000249" },
        tokenBAmount: { rawAmount: "250", displayAmount: "0.00000000000000025" },
      }),
      segment(10, 20, "1000000000000000000", {
        currentTickRelation: "outside-above",
        graphHeightRatio: "1",
        tokenAAmount: { rawAmount: "499600184935518", displayAmount: "499600184.935518" },
        tokenBAmount: { rawAmount: "0", displayAmount: "0" },
      }),
    ]);
  });

  it("builds one-tick bins around the current tick at maximum zoom", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: -10, liquidityNet: "100" },
      { tick: 10, liquidityNet: "-100" },
    ];

    const segments = buildPoolLiquiditySegments(ticks, {
      currentTick: 0,
      visibleTickRange: LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES.length - 1],
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    });

    expect(segments.length).toBe(LIQUIDITY_GRAPH_BIN_COUNT);
    expect(segments[0].minTick).toBe(-20);
    expect(segments[0].maxTick).toBe(-19);
    expect(segments[20].minTick).toBe(0);
    expect(segments[20].maxTick).toBe(1);
    expect(segments[39].minTick).toBe(19);
    expect(segments[39].maxTick).toBe(20);
    expect(segments.map(current => current.maxTick - current.minTick)).toEqual(
      Array.from({ length: LIQUIDITY_GRAPH_BIN_COUNT }, () => 1),
    );
  });

  it("builds full-range bins at minimum zoom", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: MIN_TICK, liquidityNet: "100" },
      { tick: MAX_TICK, liquidityNet: "-100" },
    ];

    const segments = buildPoolLiquiditySegments(ticks, {
      currentTick: 0,
      visibleTickRange: LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[0],
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    });
    const widths = segments.map(current => current.maxTick - current.minTick);

    expect(segments.length).toBe(LIQUIDITY_GRAPH_BIN_COUNT);
    expect(segments[0].minTick).toBe(MIN_TICK);
    expect(segments[segments.length - 1].maxTick).toBe(MAX_TICK);
    expect(Array.from(new Set(widths)).sort((left, right) => left - right)).toEqual([44_363, 44_364]);
  });

  it("keeps full-range binning bounded before current tick data is available", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: MIN_TICK, liquidityNet: "100" },
      { tick: MAX_TICK, liquidityNet: "-100" },
    ];

    const segments = buildPoolLiquiditySegments(ticks, {
      visibleTickRange: LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[0],
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    });

    expect(segments.length).toBe(LIQUIDITY_GRAPH_BIN_COUNT);
    expect(segments[0].minTick).toBe(MIN_TICK);
    expect(segments[segments.length - 1].maxTick).toBe(MAX_TICK);
  });

  it("does not fall back to unbounded raw segments when a centered zoom lacks current tick data", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: 0, liquidityNet: "100" },
      { tick: 10_000, liquidityNet: "-100" },
    ];

    const segments = buildPoolLiquiditySegments(ticks, {
      visibleTickRange: LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES.length - 1],
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    });

    expect(segments).toEqual([]);
  });

  it("clamps the one-tick zoom window at protocol tick boundaries", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: MIN_TICK, liquidityNet: "100" },
      { tick: MAX_TICK, liquidityNet: "-100" },
    ];
    const options = {
      visibleTickRange: LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES.length - 1],
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    };

    const lowerSegments = buildPoolLiquiditySegments(ticks, {
      currentTick: MIN_TICK + 1,
      ...options,
    });
    const upperSegments = buildPoolLiquiditySegments(ticks, {
      currentTick: MAX_TICK - 1,
      ...options,
    });

    expect(lowerSegments[0].minTick).toBe(MIN_TICK);
    expect(lowerSegments[lowerSegments.length - 1].maxTick).toBe(MIN_TICK + LIQUIDITY_GRAPH_BIN_COUNT);
    expect(upperSegments[0].minTick).toBe(MAX_TICK - LIQUIDITY_GRAPH_BIN_COUNT);
    expect(upperSegments[upperSegments.length - 1].maxTick).toBe(MAX_TICK);
  });

  it("splits sparse initialized liquidity into one-tick bins around the current tick", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: 0, liquidityNet: "594769984314" },
      { tick: 13_860, liquidityNet: "-594769984314" },
    ];

    const segments = buildPoolLiquiditySegments(ticks, {
      currentTick: 6_932,
      visibleTickRange: LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES.length - 1],
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    });

    expect(segments.length).toBe(LIQUIDITY_GRAPH_BIN_COUNT);
    expect(segments[0]).toEqual(
      segment(6912, 6913, "594769984314", {
        currentTickRelation: "outside-below",
      }),
    );
    expect(segments[20]).toEqual(
      segment(6932, 6933, "594769984314", {
        currentTickRelation: "at-lower-boundary",
      }),
    );
    expect(segments[39]).toEqual(
      segment(6951, 6952, "594769984314", {
        currentTickRelation: "outside-above",
      }),
    );
  });

  it("keeps visual bin widths fixed while preserving liquidity that crosses inside a bucket", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: 0, liquidityNet: "594769984314" },
      { tick: 13_860, liquidityNet: "-594769984314" },
    ];

    const segments = buildPoolLiquiditySegments(ticks, {
      currentTick: 6_932,
      visibleTickRange: LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[3],
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    });

    expect(segments.length).toBe(LIQUIDITY_GRAPH_BIN_COUNT);
    expect(segments[0].maxTick - segments[0].minTick).toBeGreaterThan(1);
    expect(segments.some(current => current.minTick === 0 || current.maxTick === 0)).toBe(false);
    expect(segments.some(current => current.minTick === 13_860 || current.maxTick === 13_860)).toBe(false);
    expect(segments[3].liquidity).toBe("0");
    expect(segments[4].liquidity).toBe("594769984314");
    expect(segments[35].liquidity).toBe("594769984314");
    expect(segments[36].liquidity).toBe("0");
  });

  it("keeps visual bin widths fixed while lowering heights to clipped amount intervals", () => {
    const tokenA = makeToken("USDC", 6, "usdc");
    const tokenB = makeToken("USDT", 6, "usdt");
    const ticks: PoolLiquidityTickModel[] = [
      { tick: 0, liquidityNet: "1000000000000000000" },
      { tick: 10, liquidityNet: "-1000000000000000000" },
      { tick: 100, liquidityNet: "1000000000000000000" },
      { tick: 200, liquidityNet: "-1000000000000000000" },
    ];

    const segments = buildPoolLiquiditySegments(ticks, {
      currentTick: 150,
      tokenA,
      tokenB,
      includeTokenAmounts: true,
      visibleTickRange: 300,
      binCount: 3,
    });

    expect(segments.map(current => [current.minTick, current.maxTick, current.amountMinTick, current.amountMaxTick])).toEqual(
      [
        [0, 100, 0, 10],
        [100, 200, 100, 200],
        [200, 300, 200, 200],
      ],
    );
    expect(Number(segments[0].graphHeightRatio)).toBeLessThanOrEqual(0.2);
  });


  it("keeps the dev API ETH/USDC page fixture from collapsing one side", () => {
    const eth = makeToken("ETH", 6, "test_eth");
    const usdc = makeToken("USDC", 6, "test_usdc");
    const ticks: PoolLiquidityTickModel[] = [
      { liquidityNet: "89453877208904", tick: -887220 },
      { liquidityNet: "153139526890", tick: 69060 },
      { liquidityNet: "-153139526890", tick: 82920 },
      { liquidityNet: "-89453877208904", tick: 887220 },
    ];

    const segments = buildPoolLiquiditySegments(ticks, {
      currentTick: 76_013,
      includeTokenAmounts: true,
      tokenA: eth,
      tokenB: usdc,
    });

    expect(segments).toEqual([
      segment(-887220, 69060, "89453877208904", {
        currentTickRelation: "outside-below",
        graphHeightRatio: "0.997702757702025718",
        tokenAAmount: { rawAmount: "0", displayAmount: "0" },
        tokenBAmount: { rawAmount: "2825810529452684", displayAmount: "2825810529.452684" },
      }),
      segment(69060, 82920, "89607016735794", {
        currentTickRelation: "inside",
        graphHeightRatio: "0.828633015419145549",
        tokenAAmount: { rawAmount: "585098199928", displayAmount: "585098.199928" },
        tokenBAmount: { rawAmount: "1176734536686910", displayAmount: "1176734536.68691" },
      }),
      segment(82920, 887220, "89453877208904", {
        currentTickRelation: "outside-above",
        graphHeightRatio: "1",
        tokenAAmount: { rawAmount: "1416133740307", displayAmount: "1416133.740307" },
        tokenBAmount: { rawAmount: "0", displayAmount: "0" },
      }),
    ]);
    expect(Number(segments[1].graphHeightRatio) > 0.8).toBe(true);
  });

  it("handles the dev API WUGNOT/GNS ticks fixture without BigInt-to-Number exponent conversion", () => {
    const wugnot = makeToken("WUGNOT", 6, "wugnot");
    const gns = makeToken("GNS", 6, "gns");
    const ticks: PoolLiquidityTickModel[] = [
      { liquidityNet: "447209583690", tick: -887220 },
      { liquidityNet: "3050595494044", tick: 23040 },
      { liquidityNet: "54007015251", tick: 28920 },
      { liquidityNet: "-54007015251", tick: 30900 },
      { liquidityNet: "-3050595494044", tick: 36900 },
      { liquidityNet: "-447209583690", tick: 887220 },
    ];

    const segments = buildPoolLiquiditySegments(ticks, {
      currentTick: 30_000,
      includeTokenAmounts: true,
      tokenA: wugnot,
      tokenB: gns,
    });

    expect(segments).toEqual([
      segment(-887220, 23040, "447209583690", {
        currentTickRelation: "outside-below",
        graphHeightRatio: "0.364372004282489012",
        tokenAAmount: { rawAmount: "0", displayAmount: "0" },
        tokenBAmount: { rawAmount: "1415120203422", displayAmount: "1415120.203422" },
      }),
      segment(23040, 28920, "3497805077734", {
        currentTickRelation: "outside-below",
        graphHeightRatio: "0.973993474895518184",
        tokenAAmount: { rawAmount: "0", displayAmount: "0" },
        tokenBAmount: { rawAmount: "3782721581588", displayAmount: "3782721.581588" },
      }),
      segment(28920, 30900, "3551812092985", {
        currentTickRelation: "inside",
        graphHeightRatio: "0.395761652531197769",
        tokenAAmount: { rawAmount: "34873628001", displayAmount: "34873.628001" },
        tokenBAmount: { rawAmount: "836678436122", displayAmount: "836678.436122" },
      }),
      segment(30900, 36900, "3497805077734", {
        currentTickRelation: "outside-above",
        graphHeightRatio: "1",
        tokenAAmount: { rawAmount: "193388223517", displayAmount: "193388.223517" },
        tokenBAmount: { rawAmount: "0", displayAmount: "0" },
      }),
      segment(36900, 887220, "447209583690", {
        currentTickRelation: "outside-above",
        graphHeightRatio: "0.365466706791414659",
        tokenAAmount: { rawAmount: "70676957181", displayAmount: "70676.957181" },
        tokenBAmount: { rawAmount: "0", displayAmount: "0" },
      }),
    ]);
  });
});

describe("createPoolLiquiditySegmentMemo", () => {
  it("runs the expensive transform once per tick/options input change, not per hover or render", () => {
    const ticks: PoolLiquidityTickModel[] = Array.from({ length: 1_000 }, (_, index) => ({
      tick: index,
      liquidityNet: index === 0 ? "100" : index === 999 ? "-100" : "0",
    }));
    const firstSegments = [segment(0, 999, "100", { currentTickRelation: "inside" })];
    const secondSegments = [segment(0, 1_000, "100", { currentTickRelation: "inside" })];
    let transformCalls = 0;
    const transform = (
      inputTicks: PoolLiquidityTickModel[],
      inputOptions?: PoolLiquiditySegmentBuildOptions,
    ): PoolLiquiditySegmentModel[] => {
      void inputTicks;
      void inputOptions;
      transformCalls += 1;
      return transformCalls === 1 ? firstSegments : secondSegments;
    };
    const memoizedTransform = createPoolLiquiditySegmentMemo(transform);
    const options = { currentTick: 500, visibleTickRange: 200, binCount: LIQUIDITY_GRAPH_BIN_COUNT };

    expect(memoizedTransform(ticks, options)).toBe(firstSegments);
    expect(memoizedTransform(ticks, options)).toBe(firstSegments);
    expect(memoizedTransform(ticks, options)).toBe(firstSegments);
    expect(transformCalls).toBe(1);

    const changedTicks = [...ticks, { tick: 1_000, liquidityNet: "0" }];
    expect(memoizedTransform(changedTicks, options)).toBe(secondSegments);
    expect(transformCalls).toBe(2);
  });
});

describe("derivePoolLiquidityTokenAmounts", () => {
  it("derives tooltip token amounts with concentrated-liquidity math instead of linear tick-width splits", () => {
    const tokenA = makeToken("USDC", 6, "usdc");
    const tokenB = makeToken("GNOT", 18, "gnot");
    const liquidity = "1000000000000000000";
    const minTick = 0;
    const maxTick = 100;
    const currentTick = 50;
    const belowAmounts = getAmountsForLiquidity(
      tickToSqrtPriceX96(-1),
      tickToSqrtPriceX96(minTick),
      tickToSqrtPriceX96(maxTick),
      BigInt(liquidity),
    );
    const insideAmounts = getAmountsForLiquidity(
      tickToSqrtPriceX96(currentTick),
      tickToSqrtPriceX96(minTick),
      tickToSqrtPriceX96(maxTick),
      BigInt(liquidity),
    );
    const aboveAmounts = getAmountsForLiquidity(
      tickToSqrtPriceX96(101),
      tickToSqrtPriceX96(minTick),
      tickToSqrtPriceX96(maxTick),
      BigInt(liquidity),
    );

    expect(
      derivePoolLiquidityTokenAmounts({
        liquidity,
        minTick,
        maxTick,
        currentTick: -1,
        tokenA,
        tokenB,
      }),
    ).toEqual({
      tokenAAmount: { rawAmount: belowAmounts.amount0.toString(), displayAmount: "4987272070.749096" },
      tokenBAmount: { rawAmount: "0", displayAmount: "0" },
    });

    expect(
      derivePoolLiquidityTokenAmounts({
        liquidity,
        minTick,
        maxTick,
        currentTick,
        tokenA,
        tokenB,
      }),
    ).toEqual({
      tokenAAmount: { rawAmount: insideAmounts.amount0.toString(), displayAmount: "2490519147.795409" },
      tokenBAmount: { rawAmount: insideAmounts.amount1.toString(), displayAmount: "0.002503002301265531" },
    });

    expect(
      derivePoolLiquidityTokenAmounts({
        liquidity,
        minTick,
        maxTick,
        currentTick: 101,
        tokenA,
        tokenB,
      }),
    ).toEqual({
      tokenAAmount: { rawAmount: "0", displayAmount: "0" },
      tokenBAmount: {
        rawAmount: aboveAmounts.amount1.toString(),
        displayAmount: "0.005012269623051203",
      },
    });
  });
});
