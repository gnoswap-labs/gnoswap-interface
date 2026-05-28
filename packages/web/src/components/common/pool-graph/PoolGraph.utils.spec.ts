import { PoolLiquiditySegmentModel, PoolLiquidityTickModel } from "@models/pool/pool-liquidity-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { TokenModel } from "@models/token/token-model";
import { buildPoolLiquiditySegments } from "@utils/pool-liquidity-utils";

import {
  createPoolGraphBins,
  formatPoolGraphTokenUsd,
  formatPoolGraphTooltipPrice,
  getPoolGraphTooltipTick,
} from "./PoolGraph.utils";

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void): void;
declare function expect(actual: unknown): {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toBeGreaterThan(expected: number): void;
};

const makeToken = (symbol: string, decimals: number): TokenModel => ({
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  tokenId: `gno.land/r/demo/${symbol.toLowerCase()}.${symbol}`,
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

const tokenA = makeToken("USDC", 6);
const tokenB = makeToken("GNOT", 18);
const tokenC = makeToken("GNS", 18);

const segment = (minTick: number, maxTick: number, liquidity: string): PoolLiquiditySegmentModel => ({
  minTick,
  maxTick,
  amountMinTick: minTick,
  amountMaxTick: maxTick,
  displayMinTick: minTick,
  displayMaxTick: maxTick,
  liquidity,
  graphHeightRatio: "1",
  currentTickRelation: "inside",
  isDisplayInverted: false,
  tokenAAmount: { rawAmount: liquidity, displayAmount: liquidity },
  tokenBAmount: { rawAmount: "0", displayAmount: "0" },
});

describe("createPoolGraphBins", () => {
  it("formats hovered-bin tick prices with five significant digits", () => {
    expect(formatPoolGraphTooltipPrice(0, tokenB, tokenC)).toBe("1");
    expect(formatPoolGraphTooltipPrice(50, tokenB, tokenC)).toBe("1.005");
    expect(formatPoolGraphTooltipPrice(100, tokenB, tokenC)).toBe("1.01");
  });

  it("uses the current tick for the bin immediately below the current-price boundary", () => {
    expect(getPoolGraphTooltipTick({ sourceMinTick: 6_931, sourceMaxTick: 6_932 }, 6_932)).toBe(6_932);
    expect(getPoolGraphTooltipTick({ sourceMinTick: 6_932, sourceMaxTick: 6_933 }, 6_932)).toBe(6_932);
    expect(getPoolGraphTooltipTick({ sourceMinTick: 6_930, sourceMaxTick: 6_931 }, 6_932)).toBe(6_930);
  });

  it("abbreviates tooltip token USD amounts with price prefixes", () => {
    const tokenPrices: Record<string, TokenPriceModel> = {
      GNOT: {
        path: "GNOT",
        usd: "1000",
        change1h: "0",
        change1d: "0",
        change7d: "0",
        change30d: "0",
        marketCap: "0",
        liquidity: "0",
        volume: "0",
        mostLiquidityPool: "",
        last7d: [],
        pricesBefore: {
          latestPrice: "0",
          priceToday: "0",
          price1h: "0",
          price2h: "0",
          price1d: "0",
          price2d: "0",
          price7d: "0",
          price8d: "0",
          price30d: "0",
          price31d: "0",
          price60d: "0",
          price61d: "0",
          price90d: "0",
          price91d: "0",
        },
        volumeUsd24h: "0",
        feeUsd24h: "0",
        lockedTokensUsd: "0",
        priceGradeType: "NONE",
      },
    };

    expect(formatPoolGraphTokenUsd("1.2345", tokenB, tokenPrices)).toBe("$1.23K");
  });

  it("keeps the complete full-range segment list instead of centered slicing", () => {
    const liquiditySegments = Array.from({ length: 60 }, (_, index) => segment(index * 10, index * 10 + 10, "1"));

    const bins = createPoolGraphBins({ liquiditySegments, boundsHeight: 100, tokenA, tokenB, currentTick: 250 });

    expect(bins.length).toBe(60);
    expect(bins[0].sourceMinTick).toBe(0);
    expect(bins[59].sourceMaxTick).toBe(600);
  });

  it("returns an empty graph-safe bin list for empty tick data", () => {
    expect(createPoolGraphBins({ liquiditySegments: [], boundsHeight: 100, tokenA, tokenB, currentTick: 0 })).toEqual(
      [],
    );
  });

  it("uses decimal-normalized segment height ratios for mixed-decimal pools", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: 0, liquidityNet: "1000000" },
      { tick: 10, liquidityNet: "999999999999000000" },
      { tick: 20, liquidityNet: "-1000000000000000000" },
    ];
    const liquiditySegments = buildPoolLiquiditySegments(ticks, {
      currentTick: 5,
      tokenA,
      tokenB,
      includeTokenAmounts: true,
    });

    const bins = createPoolGraphBins({ liquiditySegments, boundsHeight: 100, tokenA, tokenB, currentTick: 5 });

    expect(bins.map(bin => bin.reserveTokenMap)).toEqual([9.985490000000001e-11, 100]);
    expect(bins.map(bin => bin.reserveTokenA)).toEqual(["0.000249", "499600184.935518"]);
    expect(bins.map(bin => bin.reserveTokenB)).toEqual(["0.00000000000000025", "0"]);
  });

  it("builds position overlay bins from position-owned liquidity and tick bounds", () => {
    const liquiditySegments = [segment(0, 30, "1000000000000000000")];

    const bins = createPoolGraphBins({
      liquiditySegments,
      boundsHeight: 100,
      tokenA,
      tokenB,
      currentTick: 10,
      positionLiquidity: "250000000000000000",
      positionTickLower: 5,
      positionTickUpper: 20,
    });

    expect(bins.map(bin => [bin.sourceMinTick, bin.sourceMaxTick, bin.isPositionActive])).toEqual([
      [0, 30, true],
    ]);
    expect(bins[0].minTick).toBe(0);
    expect(bins[0].maxTick).toBe(30);
    expect(bins[0].positionReserveTokenMap).toBeGreaterThan(0);
    expect(bins[0].reserveTokenAMyAmount).toBe("124900046.233879");
    expect(bins[0].liquidity).toBe("1000000000000000000");
    expect(bins[0].positionLiquidityShare).toBe("25%");
  });

  it("scales mixed-decimal position overlays by displayed token amounts", () => {
    const ticks: PoolLiquidityTickModel[] = [
      { tick: 0, liquidityNet: "1000000" },
      { tick: 10, liquidityNet: "999999999999000000" },
      { tick: 20, liquidityNet: "-1000000000000000000" },
    ];
    const liquiditySegments = buildPoolLiquiditySegments(ticks, {
      currentTick: 5,
      tokenA,
      tokenB,
      includeTokenAmounts: true,
    });

    const bins = createPoolGraphBins({
      liquiditySegments,
      boundsHeight: 100,
      tokenA,
      tokenB,
      currentTick: 5,
      positionLiquidity: "500000000000000000",
      positionTickLower: 10,
      positionTickUpper: 20,
    });

    expect(bins.map(bin => bin.positionReserveTokenMap)).toEqual([0, 50]);
    expect(bins.map(bin => bin.positionLiquidityShare)).toEqual(["0%", "50%"]);
    expect(bins[1].reserveTokenAMyAmount).toBe("249800092.467759");
  });

  it("formats position share from active liquidity ownership for partial-bin overlaps", () => {
    const liquiditySegments = buildPoolLiquiditySegments(
      [
        { tick: 0, liquidityNet: "1000000000000000000" },
        { tick: 100, liquidityNet: "-1000000000000000000" },
      ],
      {
        currentTick: 50,
        tokenA,
        tokenB,
        includeTokenAmounts: true,
        visibleTickRange: 300,
        binCount: 3,
      },
    );

    const bins = createPoolGraphBins({
      liquiditySegments,
      boundsHeight: 100,
      tokenA,
      tokenB,
      currentTick: 50,
      positionLiquidity: "1000000000000000000",
      positionTickLower: 80,
      positionTickUpper: 100,
    });

    expect(bins[1].positionLiquidityShare).toBe("100%");
  });

  it("clips fixed visual-bin tooltip totals to the actual active tick range", () => {
    const liquiditySegments = buildPoolLiquiditySegments(
      [
        { tick: 0, liquidityNet: "1000000000000000000" },
        { tick: 100, liquidityNet: "-1000000000000000000" },
      ],
      {
        currentTick: -50,
        tokenA,
        tokenB,
        includeTokenAmounts: true,
        visibleTickRange: 300,
        binCount: 3,
      },
    );

    const bins = createPoolGraphBins({
      liquiditySegments,
      boundsHeight: 100,
      tokenA,
      tokenB,
      currentTick: -50,
      positionLiquidity: "1000000000000000000",
      positionTickLower: 0,
      positionTickUpper: 100,
    });

    expect(bins.map(bin => [bin.sourceMinTick, bin.sourceMaxTick])).toEqual([
      [-200, -100],
      [-100, 0],
      [0, 100],
    ]);
    expect(bins[2].reserveTokenA).toBe(bins[2].reserveTokenAMyAmount);
    expect(bins[2].reserveTokenB).toBe(bins[2].reserveTokenBMyAmount);
    expect(bins[2].positionLiquidityShare).toBe("100%");
  });

  it("keeps position overlay visually active when only the visual bin overlaps", () => {
    const liquiditySegments: PoolLiquiditySegmentModel[] = [
      {
        minTick: 0,
        maxTick: 100,
        amountMinTick: 0,
        amountMaxTick: 10,
        displayMinTick: 0,
        displayMaxTick: 100,
        liquidity: "1000000000000000000",
        graphHeightRatio: "1",
        currentTickRelation: "inside",
        isDisplayInverted: false,
        tokenAAmount: { rawAmount: "4987272070749096", displayAmount: "4987272070.749096" },
        tokenBAmount: { rawAmount: "0", displayAmount: "0" },
      },
    ];

    const bins = createPoolGraphBins({
      liquiditySegments,
      boundsHeight: 100,
      tokenA,
      tokenB,
      currentTick: 50,
      positionLiquidity: "1000000000000000000",
      positionTickLower: 50,
      positionTickUpper: 100,
    });

    expect(bins[0].isPositionActive).toBe(false);
    expect(bins[0].isPositionVisualActive).toBe(true);
    expect(bins[0].positionReserveTokenMap).toBeGreaterThan(0);
    expect(bins[0].reserveTokenAMyAmount).toBe(null);
    expect(bins[0].positionLiquidityShare).toBe("0%");
  });

  it("marks token rows visible only when the hovered bin composition actually contains that token", () => {
    const liquiditySegments = buildPoolLiquiditySegments(
      [
        { tick: 0, liquidityNet: "1000000000000000000" },
        { tick: 100, liquidityNet: "-1000000000000000000" },
      ],
      {
        currentTick: 50,
        tokenA,
        tokenB,
        includeTokenAmounts: true,
        visibleTickRange: 300,
        binCount: 3,
      },
    );

    const bins = createPoolGraphBins({ liquiditySegments, boundsHeight: 100, tokenA, tokenB, currentTick: 50 });

    expect(bins.map(bin => [bin.sourceMinTick, bin.sourceMaxTick])).toEqual([
      [-100, 0],
      [0, 100],
      [100, 200],
    ]);
    expect(bins.map(bin => [bin.reserveTokenAVisible, bin.reserveTokenBVisible])).toEqual([
      [false, false],
      [true, true],
      [false, false],
    ]);
  });

  it("shows both token rows for the current-tick bin even when the tick is on a bin boundary", () => {
    const liquiditySegments = buildPoolLiquiditySegments(
      [
        { tick: 0, liquidityNet: "1000000000000000000" },
        { tick: 100, liquidityNet: "-1000000000000000000" },
      ],
      {
        currentTick: 0,
        tokenA,
        tokenB,
        includeTokenAmounts: true,
      },
    );

    const bins = createPoolGraphBins({ liquiditySegments, boundsHeight: 100, tokenA, tokenB, currentTick: 0 });

    expect(bins[0].reserveTokenA).toBe("4987272070.749096");
    expect(bins[0].reserveTokenB).toBe("0");
    expect([bins[0].reserveTokenAVisible, bins[0].reserveTokenBVisible]).toEqual([true, true]);
  });

  it("shows both token rows when a bin contains both token amounts", () => {
    const liquiditySegments = buildPoolLiquiditySegments(
      [
        { tick: 0, liquidityNet: "1000000000000000000" },
        { tick: 100, liquidityNet: "-1000000000000000000" },
      ],
      {
        currentTick: 50,
        tokenA,
        tokenB,
        includeTokenAmounts: true,
      },
    );

    const bins = createPoolGraphBins({ liquiditySegments, boundsHeight: 100, tokenA, tokenB, currentTick: 50 });

    expect(bins[0].reserveTokenA).toBe("2490519147.795409");
    expect(bins[0].reserveTokenB).toBe("0.002503002301265531");
    expect([bins[0].reserveTokenAVisible, bins[0].reserveTokenBVisible]).toEqual([true, true]);
  });
});
