import BigNumber from "bignumber.js";
import { LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES, LIQUIDITY_GRAPH_BIN_COUNT } from "@constants/graph.constant";
import { buildPoolLiquiditySegments, derivePoolLiquidityTokenAmounts } from "@utils/pool-liquidity-utils";
import { createPoolGraphBins } from "./PoolGraph.utils";

const tokenA = { path: "token-a", decimals: 6, symbol: "A", displaySymbol: "A" };
const tokenB = { path: "token-b", decimals: 18, symbol: "B", displaySymbol: "B" };
const currentTick = 0;
const liquidity = "1000000000000000000";
// The owned position spans both a low-liquidity interval and an overlapping position.
const ticks = [
  { tick: -100, liquidityNet: liquidity },
  { tick: -10, liquidityNet: "3000000000000000000" },
  { tick: 10, liquidityNet: "-3000000000000000000" },
  { tick: 100, liquidityNet: `-${liquidity}` },
];

const binsFor = (range: number, isReversed = false, poolTicks = ticks) =>
  createPoolGraphBins({
    liquiditySegments: buildPoolLiquiditySegments(poolTicks, {
      currentTick,
      tokenA,
      tokenB,
      includeTokenAmounts: true,
      visibleTickRange: range,
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    }),
    boundsHeight: 100,
    tokenA,
    tokenB,
    currentTick,
    isReversed,
    positionLiquidity: liquidity,
    positionTickLower: -100,
    positionTickUpper: 100,
  });

it("conserves owned and pool token amounts at every zoom level and in either token order", () => {
  for (const range of LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES) {
    const minTick = Math.max(-100, -Math.floor(range / 2));
    const maxTick = Math.min(100, Math.ceil(range / 2));
    const owned = derivePoolLiquidityTokenAmounts({ liquidity, minTick, maxTick, currentTick, tokenA, tokenB });
    const overlap = derivePoolLiquidityTokenAmounts({
      liquidity: "3000000000000000000",
      minTick: Math.max(minTick, -10),
      maxTick: Math.min(maxTick, 10),
      currentTick,
      tokenA,
      tokenB,
    });
    for (const reversed of [false, true]) {
      const bins = binsFor(range, reversed);
      for (const key of ["A", "B"] as const) {
        const sourceKey = reversed ? (key === "A" ? "B" : "A") : key;
        const expectedOwned = owned[`token${sourceKey}Amount`];
        const expectedPool = BigInt(expectedOwned.rawAmount) + BigInt(overlap[`token${sourceKey}Amount`].rawAmount);
        const sum = (mine: boolean) =>
          bins.reduce(
            (total, bin) =>
              total.plus(
                (mine
                  ? bin[key === "A" ? "reserveTokenAMyAmount" : "reserveTokenBMyAmount"]
                  : bin[key === "A" ? "reserveTokenA" : "reserveTokenB"]) ?? "0",
              ),
            new BigNumber(0),
          );
        const unit = new BigNumber(10).pow(sourceKey === "A" ? tokenA.decimals : tokenB.decimals);
        // Integer amount math rounds down at each interval; the error is bounded by the number of splits.
        expect(sum(true).times(unit).minus(expectedOwned.rawAmount).abs().lte(bins.length)).toBe(true);
        expect(
          sum(false)
            .times(unit)
            .minus(expectedPool.toString())
            .abs()
            .lte(bins.length * 2),
        ).toBe(true);
      }
    }
  }
});

it("reports the share of the displayed bin amounts and updates when pool liquidity changes", () => {
  const bin = binsFor(LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[0]).find(bin => bin.isPositionVisualActive)!;
  // The pool includes 3L only over [-10, 10], not over the owned position's entire range.
  expect(bin.positionLiquidityShare).toBe("76.88%");
  const updated = binsFor(LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[0], false, [ticks[0], ticks[3]]).find(
    bin => bin.isPositionVisualActive,
  )!;
  expect(updated.positionLiquidityShare).toBe("100%");
});
