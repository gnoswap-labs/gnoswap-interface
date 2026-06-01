import BigNumber from "bignumber.js";
import { MAX_TICK, MIN_TICK } from "@constants/swap.constant";
import { getAmountsForLiquidity } from "./liquidity-utils";
import { tickToSqrtPriceX96 } from "./math.utils";
import { tickToPrice } from "./swap-utils";
import {
  BuildPoolLiquiditySegmentsFn,
  PoolLiquidityDerivedTokenAmounts,
  PoolLiquidityCurrentTickRelation,
  PoolLiquiditySegmentBuildOptions,
  PoolLiquiditySegmentModel,
  PoolLiquidityTickModel,
  PoolLiquidityTokenAmountModel,
  PoolLiquidityTokenAmountBuildOptions,
} from "@models/pool/pool-liquidity-model";

const RATIO_SCALE_DECIMALS = 18;
const FULL_TICK_RANGE = MAX_TICK - MIN_TICK;

const pow10 = (decimals: number): bigint => {
  const normalizedDecimals = Number.isFinite(decimals) ? Math.max(0, Math.trunc(decimals)) : 0;
  let result = 1n;

  for (let index = 0; index < normalizedDecimals; index += 1) {
    result *= 10n;
  }

  return result;
};


interface FoldedLiquidityTick {
  tick: number;
  liquidityNet: bigint;
}

interface SegmentHeightInterval {
  minTick: number;
  maxTick: number;
  liquidity: bigint;
}

interface SegmentDraft {
  minTick: number;
  maxTick: number;
  amountMinTick: number;
  amountMaxTick: number;
  liquidity: bigint;
  heightIntervals: SegmentHeightInterval[];
}

const sortTicks = (ticks: PoolLiquidityTickModel[]): FoldedLiquidityTick[] => {
  const folded = new Map<number, bigint>();

  for (const tick of ticks) {
    const liquidityNet = BigInt(tick.liquidityNet);
    folded.set(tick.tick, (folded.get(tick.tick) ?? 0n) + liquidityNet);
  }

  return Array.from(folded.entries())
    .map(([tick, liquidityNet]) => ({ tick, liquidityNet }))
    .sort((left, right) => left.tick - right.tick);
};

const buildSegmentDrafts = (foldedTicks: FoldedLiquidityTick[]): SegmentDraft[] => {
  const segments: SegmentDraft[] = [];
  let activeLiquidity = 0n;

  for (let index = 0; index < foldedTicks.length - 1; index += 1) {
    const current = foldedTicks[index];
    const next = foldedTicks[index + 1];

    activeLiquidity += current.liquidityNet;

    if (activeLiquidity > 0n && current.tick < next.tick) {
      segments.push({
        minTick: current.tick,
        maxTick: next.tick,
        amountMinTick: current.tick,
        amountMaxTick: next.tick,
        liquidity: activeLiquidity,
        heightIntervals: [{ minTick: current.tick, maxTick: next.tick, liquidity: activeLiquidity }],
      });
    }
  }

  return segments;
};

const buildVisualBinDrafts = (
  foldedTicks: FoldedLiquidityTick[],
  currentTick: number | undefined,
  visibleTickRange: number | undefined,
  binCount: number | undefined,
): SegmentDraft[] => {
  if (!visibleTickRange || !binCount || visibleTickRange <= 0 || binCount <= 0) {
    return buildSegmentDrafts(foldedTicks);
  }

  const normalizedRange = Math.min(FULL_TICK_RANGE, Math.max(1, Math.trunc(visibleTickRange)));
  const normalizedBinCount = Math.max(1, Math.trunc(binCount));
  let startTick: number;
  let endTick: number;

  if (normalizedRange >= FULL_TICK_RANGE) {
    startTick = MIN_TICK;
    endTick = MAX_TICK;
  } else {
    if (currentTick === undefined) {
      return [];
    }

    const clampedCurrentTick = Math.min(MAX_TICK, Math.max(MIN_TICK, currentTick));
    startTick = clampedCurrentTick - Math.floor(normalizedRange / 2);
    endTick = startTick + normalizedRange;

    if (startTick < MIN_TICK) {
      startTick = MIN_TICK;
      endTick = startTick + normalizedRange;
    }

    if (endTick > MAX_TICK) {
      endTick = MAX_TICK;
      startTick = endTick - normalizedRange;
    }
  }

  const visualBins: SegmentDraft[] = [];
  let activeLiquidity = 0n;
  let tickIndex = 0;

  while (tickIndex < foldedTicks.length && foldedTicks[tickIndex].tick < startTick) {
    activeLiquidity += foldedTicks[tickIndex].liquidityNet;
    tickIndex += 1;
  }

  if (activeLiquidity < 0n) {
    activeLiquidity = 0n;
  }

  const visibleRange = endTick - startTick;

  for (let index = 0; index < normalizedBinCount; index += 1) {
    const binMinTick = startTick + Math.floor((visibleRange * index) / normalizedBinCount);
    const binMaxTick = startTick + Math.floor((visibleRange * (index + 1)) / normalizedBinCount);
    let binLiquidity = 0n;
    let amountMinTick: number | null = null;
    let amountMaxTick: number | null = null;
    const heightIntervals: SegmentHeightInterval[] = [];
    let intervalStartTick = binMinTick;

    const applyInterval = (liquidity: bigint, minTick: number, maxTick: number) => {
      if (liquidity <= 0n || minTick >= maxTick) {
        return;
      }

      heightIntervals.push({ minTick, maxTick, liquidity });

      if (liquidity > binLiquidity) {
        binLiquidity = liquidity;
        amountMinTick = minTick;
        amountMaxTick = maxTick;
        return;
      }

      if (liquidity === binLiquidity && amountMaxTick === minTick) {
        amountMaxTick = maxTick;
      }
    };

    while (tickIndex < foldedTicks.length && foldedTicks[tickIndex].tick < binMaxTick) {
      if (foldedTicks[tickIndex].tick >= binMinTick) {
        applyInterval(activeLiquidity, intervalStartTick, foldedTicks[tickIndex].tick);
        activeLiquidity += foldedTicks[tickIndex].liquidityNet;

        if (activeLiquidity < 0n) {
          activeLiquidity = 0n;
        }

        intervalStartTick = foldedTicks[tickIndex].tick;
      }

      tickIndex += 1;
    }

    applyInterval(activeLiquidity, intervalStartTick, binMaxTick);

    if (binMinTick < binMaxTick) {
      visualBins.push({
        minTick: binMinTick,
        maxTick: binMaxTick,
        amountMinTick: amountMinTick ?? binMinTick,
        amountMaxTick: amountMaxTick ?? binMinTick,
        liquidity: binLiquidity,
        heightIntervals,
      });
    }
  }

  return visualBins;
};

const getCurrentTickRelation = (
  segment: Pick<SegmentDraft, "minTick" | "maxTick">,
  currentTick: number | undefined,
  firstTick: number,
  lastTick: number,
): PoolLiquidityCurrentTickRelation => {
  if (currentTick === undefined) {
    return "outside-below";
  }
  if (currentTick === segment.minTick) {
    return "at-lower-boundary";
  }
  if (currentTick === segment.maxTick) {
    return "at-upper-boundary";
  }
  if (currentTick > segment.minTick && currentTick < segment.maxTick) {
    return "inside";
  }
  if (currentTick < firstTick) {
    return "outside-below";
  }
  if (currentTick > lastTick) {
    return "outside-above";
  }
  return currentTick < segment.minTick ? "outside-above" : "outside-below";
};

const isDisplayInverted = (options?: PoolLiquiditySegmentBuildOptions): boolean => {
  if (!options?.tokenA || !options.tokenB || !options.displayTokenAPath || !options.displayTokenBPath) {
    return false;
  }

  return options.displayTokenAPath === options.tokenB.path && options.displayTokenBPath === options.tokenA.path;
};

const scaleRawAmount = (rawAmount: bigint, fromDecimals: number, toDecimals: number): bigint => {
  if (fromDecimals === toDecimals) {
    return rawAmount;
  }
  if (fromDecimals < toDecimals) {
    return rawAmount * pow10(toDecimals - fromDecimals);
  }
  return rawAmount / pow10(fromDecimals - toDecimals);
};

const formatRawAmount = (rawAmount: bigint, decimals: number): string => {
  const sign = rawAmount < 0n ? "-" : "";
  const absoluteAmount = rawAmount < 0n ? -rawAmount : rawAmount;
  const divisor = pow10(decimals);
  const integerPart = absoluteAmount / divisor;
  const fractionalPart = absoluteAmount % divisor;

  if (fractionalPart === 0n || decimals === 0) {
    return `${sign}${integerPart.toString()}`;
  }

  const fractionalText = fractionalPart.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${sign}${integerPart.toString()}.${fractionalText}`;
};

const createTokenAmount = (rawAmount: bigint, decimals: number): PoolLiquidityTokenAmountModel => ({
  rawAmount: rawAmount.toString(),
  displayAmount: formatRawAmount(rawAmount, decimals),
});

const getDisplayHeightUnit = (rawAmount: bigint, decimals: number): BigNumber => {
  if (rawAmount <= 0n) {
    return BigNumber(0);
  }

  return BigNumber(scaleRawAmount(rawAmount, decimals, RATIO_SCALE_DECIMALS).toString());
};

const getDisplayAmount = (rawAmount: bigint, decimals: number): BigNumber => {
  if (rawAmount <= 0n) {
    return BigNumber(0);
  }

  return BigNumber(rawAmount.toString()).dividedBy(pow10(decimals).toString());
};

const getCurrentTokenBPerTokenA = (options: PoolLiquiditySegmentBuildOptions): BigNumber => {
  if (options.currentTick === undefined || !options.tokenA || !options.tokenB) {
    return BigNumber(0);
  }

  const price = BigNumber(tickToPrice(options.currentTick)).shiftedBy(options.tokenA.decimals - options.tokenB.decimals);
  return price.isFinite() && price.isGreaterThan(0) ? price : BigNumber(0);
};

const formatRatio = (value: BigNumber, maxValue: BigNumber): string => {
  if (!value.isFinite() || !maxValue.isFinite() || value.isLessThanOrEqualTo(0) || maxValue.isLessThanOrEqualTo(0)) {
    return "0";
  }
  if (value.isGreaterThanOrEqualTo(maxValue)) {
    return "1";
  }

  const ratioText = value.dividedBy(maxValue).decimalPlaces(RATIO_SCALE_DECIMALS).toFixed().replace(/\.?0+$/, "");
  return ratioText || "0";
};

const getSegmentDisplayAmounts = (
  segment: SegmentDraft,
  options: PoolLiquiditySegmentBuildOptions,
): PoolLiquidityDerivedTokenAmounts | null => {
  if (!options.tokenA || !options.tokenB) {
    return null;
  }

  const tokenA = options.tokenA;
  const tokenB = options.tokenB;

  const { totalTokenAAmount, totalTokenBAmount } = segment.heightIntervals.reduce(
    (totals, interval) => {
      const visualAmounts = derivePoolLiquidityTokenAmounts({
        liquidity: interval.liquidity.toString(),
        minTick: interval.minTick,
        maxTick: interval.maxTick,
        currentTick: options.currentTick ?? segment.minTick,
        tokenA,
        tokenB,
      });

      return {
        totalTokenAAmount: totals.totalTokenAAmount + BigInt(visualAmounts.tokenAAmount.rawAmount),
        totalTokenBAmount: totals.totalTokenBAmount + BigInt(visualAmounts.tokenBAmount.rawAmount),
      };
    },
    { totalTokenAAmount: 0n, totalTokenBAmount: 0n },
  );

  return {
    tokenAAmount: createTokenAmount(totalTokenAAmount, options.tokenA.decimals),
    tokenBAmount: createTokenAmount(totalTokenBAmount, options.tokenB.decimals),
  };
};

const getSegmentHeight = (
  segment: SegmentDraft,
  options: PoolLiquiditySegmentBuildOptions | undefined,
  tokenBPerTokenA: BigNumber,
): BigNumber => {
  if (options?.includeTokenAmounts && options.tokenA && options.tokenB) {
    const { tokenA, tokenB } = options;

    return segment.heightIntervals.reduce((height, interval) => {
      const visualAmounts = derivePoolLiquidityTokenAmounts({
        liquidity: interval.liquidity.toString(),
        minTick: interval.minTick,
        maxTick: interval.maxTick,
        currentTick: options.currentTick ?? segment.minTick,
        tokenA,
        tokenB,
      });
      const tokenAAmount = getDisplayAmount(BigInt(visualAmounts.tokenAAmount.rawAmount), tokenA.decimals);
      const tokenBAmount = getDisplayAmount(BigInt(visualAmounts.tokenBAmount.rawAmount), tokenB.decimals);

      if (tokenBPerTokenA.isGreaterThan(0)) {
        return height.plus(tokenAAmount).plus(tokenBAmount.dividedBy(tokenBPerTokenA));
      }

      const tokenAHeight = getDisplayHeightUnit(BigInt(visualAmounts.tokenAAmount.rawAmount), tokenA.decimals);
      const tokenBHeight = getDisplayHeightUnit(BigInt(visualAmounts.tokenBAmount.rawAmount), tokenB.decimals);
      return height.plus(BigNumber.max(tokenAHeight, tokenBHeight));
    }, BigNumber(0));
  }

  return BigNumber(segment.liquidity.toString());
};

export function buildPoolLiquiditySegments(
  ticks: PoolLiquidityTickModel[],
  options?: PoolLiquiditySegmentBuildOptions,
): PoolLiquiditySegmentModel[] {
  const foldedTicks = sortTicks(ticks).filter(tick => tick.liquidityNet !== 0n);

  if (foldedTicks.length < 2) {
    return [];
  }

  const firstTick = foldedTicks[0].tick;
  const lastTick = foldedTicks[foldedTicks.length - 1].tick;
  const inverted = isDisplayInverted(options);
  const draftedSegments = buildVisualBinDrafts(
    foldedTicks,
    options?.currentTick,
    options?.visibleTickRange,
    options?.binCount,
  );

  const segments = draftedSegments.map(segment => {
    const currentTickRelation = getCurrentTickRelation(segment, options?.currentTick, firstTick, lastTick);
    const tokenAmounts = options?.includeTokenAmounts ? getSegmentDisplayAmounts(segment, options) : null;

    return {
      minTick: segment.minTick,
      maxTick: segment.maxTick,
      amountMinTick: segment.amountMinTick,
      amountMaxTick: segment.amountMaxTick,
      displayMinTick: inverted ? -segment.maxTick : segment.minTick,
      displayMaxTick: inverted ? -segment.minTick : segment.maxTick,
      liquidity: segment.liquidity.toString(),
      graphHeightRatio: "0",
      currentTickRelation,
      isDisplayInverted: inverted,
      ...(tokenAmounts ?? {}),
    };
  });

  const tokenBPerTokenA = getCurrentTokenBPerTokenA(options ?? {});
  const segmentHeights = draftedSegments.map(segment => getSegmentHeight(segment, options, tokenBPerTokenA));
  const maxHeight = segmentHeights.reduce((currentMax, segmentHeight) => {
    return BigNumber.max(currentMax, segmentHeight);
  }, BigNumber(0));

  return segments.map((segment, index) => ({
    ...segment,
    graphHeightRatio: formatRatio(segmentHeights[index], maxHeight),
  }));
}

export function createPoolLiquiditySegmentMemo(
  transform: BuildPoolLiquiditySegmentsFn = buildPoolLiquiditySegments,
): BuildPoolLiquiditySegmentsFn {
  let previousTickSignature: string | null = null;
  let previousOptionSignature: string | null = null;
  let previousResult: PoolLiquiditySegmentModel[] = [];

  return (ticks, options) => {
    const tickSignature = ticks.map(tick => `${tick.tick}:${tick.liquidityNet}`).join("|");
    const optionSignature = JSON.stringify({
      currentTick: options?.currentTick,
      tokenAPath: options?.tokenA?.path,
      tokenADecimals: options?.tokenA?.decimals,
      tokenBPath: options?.tokenB?.path,
      tokenBDecimals: options?.tokenB?.decimals,
      displayTokenAPath: options?.displayTokenAPath,
      displayTokenBPath: options?.displayTokenBPath,
      includeTokenAmounts: options?.includeTokenAmounts,
      visibleTickRange: options?.visibleTickRange,
      binCount: options?.binCount,
    });

    if (tickSignature === previousTickSignature && optionSignature === previousOptionSignature) {
      return previousResult;
    }

    previousTickSignature = tickSignature;
    previousOptionSignature = optionSignature;
    previousResult = transform(ticks, options);
    return previousResult;
  };
}

export function derivePoolLiquidityTokenAmounts(
  options: PoolLiquidityTokenAmountBuildOptions,
): PoolLiquidityDerivedTokenAmounts {
  const liquidity = BigInt(options.liquidity);
  const currentPriceX96 = tickToSqrtPriceX96(options.currentTick);
  const minPriceX96 = tickToSqrtPriceX96(options.minTick);
  const maxPriceX96 = tickToSqrtPriceX96(options.maxTick);
  const { amount0, amount1 } = getAmountsForLiquidity(currentPriceX96, minPriceX96, maxPriceX96, liquidity);

  return {
    tokenAAmount: createTokenAmount(amount0, options.tokenA.decimals),
    tokenBAmount: createTokenAmount(amount1, options.tokenB.decimals),
  };
}
