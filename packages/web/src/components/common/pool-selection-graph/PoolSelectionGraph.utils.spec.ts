import { PoolLiquiditySegmentModel, PoolLiquidityTickModel } from "@models/pool/pool-liquidity-model";
import { TokenModel } from "@models/token/token-model";
import { MAX_TICK, MIN_TICK } from "@constants/swap.constant";
import { buildPoolLiquiditySegments } from "@utils/pool-liquidity-utils";

import {
  createPoolSelectionGraphBins,
  getPoolSelectionGraphEmptyTickWindow,
  getPoolSelectionGraphTooltipTick,
} from "./PoolSelectionGraph.utils";

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

const segment = (minTick: number, maxTick: number): PoolLiquiditySegmentModel => ({
  minTick,
  maxTick,
  amountMinTick: minTick,
  amountMaxTick: maxTick,
  displayMinTick: minTick,
  displayMaxTick: maxTick,
  liquidity: "1000000",
  graphHeightRatio: "0.5",
  currentTickRelation: "inside",
  isDisplayInverted: false,
  tokenAAmount: { rawAmount: "1000000", displayAmount: "1" },
  tokenBAmount: { rawAmount: "2000000000000000000", displayAmount: "2" },
});

describe("createPoolSelectionGraphBins", () => {
  it("uses each bin's min tick for tooltip prices at the current-price boundary", () => {
    expect(getPoolSelectionGraphTooltipTick({ minTick: 6_931, maxTick: 6_932 })).toBe(6_931);
    expect(getPoolSelectionGraphTooltipTick({ minTick: 6_932, maxTick: 6_933 })).toBe(6_932);
    expect(getPoolSelectionGraphTooltipTick({ minTick: 6_930, maxTick: 6_931 })).toBe(6_930);
  });

  it("keeps the full tick-derived segment range without centered slicing", () => {
    const liquiditySegments = Array.from({ length: 60 }, (_, index) => segment(index * 10, index * 10 + 10));

    const bins = createPoolSelectionGraphBins(liquiditySegments);

    expect(bins.length).toBe(60);
    expect(bins[0].minTick).toBe(0);
    expect(bins[59].maxTick).toBe(600);
  });

  it("returns an empty graph-safe bin list for empty tick data", () => {
    expect(createPoolSelectionGraphBins([])).toEqual([]);
  });

  it("uses decimal-normalized graphHeightRatio from liquidity segments", () => {
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

    const bins = createPoolSelectionGraphBins(liquiditySegments);

    expect(bins.map(bin => bin.height)).toEqual([9.98549e-13, 1]);
    expect(bins.map(bin => bin.reserveTokenA)).toEqual([0.000249, 499600184.935518]);
    expect(bins.map(bin => bin.reserveTokenB)).toEqual([2.5e-16, 0]);
  });

  it("preserves inverse-display mapping without horizontal shift state", () => {
    const bins = createPoolSelectionGraphBins([segment(0, 10), segment(10, 20)], true);

    expect(bins.map(bin => [bin.minTick, bin.maxTick, bin.reserveTokenA, bin.reserveTokenB])).toEqual([
      [-20, -10, 2, 1],
      [-10, 0, 2, 1],
    ]);
  });
});

describe("getPoolSelectionGraphEmptyTickWindow", () => {
  it("centers empty create-pool graphs around the current tick instead of the full protocol range", () => {
    const tickWindow = getPoolSelectionGraphEmptyTickWindow({
      currentTick: 0,
      visibleTickRange: 18_240,
      minTick: MIN_TICK,
      maxTick: MAX_TICK,
    });

    expect(tickWindow).toEqual({ minTick: -9_120, maxTick: 9_120 });
  });

  it("places selected create-pool range handles in the middle of each graph side", () => {
    const tickWindow = getPoolSelectionGraphEmptyTickWindow({
      currentTick: 0,
      visibleTickRange: 18_240,
      minTick: MIN_TICK,
      maxTick: MAX_TICK,
      selectedMinTick: -7_000,
      selectedMaxTick: 7_000,
    });

    expect(tickWindow).toEqual({ minTick: -14_000, maxTick: 14_000 });
  });

  it("uses the full protocol range only when the requested visible range covers it", () => {
    const tickWindow = getPoolSelectionGraphEmptyTickWindow({
      currentTick: 0,
      visibleTickRange: MAX_TICK - MIN_TICK,
      minTick: MIN_TICK,
      maxTick: MAX_TICK,
    });

    expect(tickWindow).toEqual({ minTick: MIN_TICK, maxTick: MAX_TICK });
  });
});
