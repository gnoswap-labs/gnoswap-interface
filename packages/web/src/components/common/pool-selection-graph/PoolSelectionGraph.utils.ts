import { PoolLiquiditySegmentModel } from "@models/pool/pool-liquidity-model";

export interface PoolSelectionGraphBin {
  index: number;
  height: number;
  minTick: number;
  maxTick: number;
  reserveTokenA: number;
  reserveTokenB: number;
}

export interface PoolSelectionGraphTickWindow {
  minTick: number;
  maxTick: number;
}

export interface PoolSelectionGraphPriceRange {
  minPrice: number;
  maxPrice: number;
}

const toFiniteNumber = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeZero = (value: number): number => (Object.is(value, -0) ? 0 : value);

export const createPoolSelectionGraphBins = (
  liquiditySegments: PoolLiquiditySegmentModel[],
  flip = false,
): PoolSelectionGraphBin[] => {
  const bins = liquiditySegments.map((segment, index) => ({
    index,
    height: toFiniteNumber(segment.graphHeightRatio),
    minTick: segment.minTick,
    maxTick: segment.maxTick,
    reserveTokenA: toFiniteNumber(segment.tokenAAmount?.displayAmount),
    reserveTokenB: toFiniteNumber(segment.tokenBAmount?.displayAmount),
  }));

  if (!flip) {
    return bins;
  }

  return bins
    .map(bin => ({
      ...bin,
      minTick: normalizeZero(-bin.maxTick),
      maxTick: normalizeZero(-bin.minTick),
      reserveTokenA: bin.reserveTokenB,
      reserveTokenB: bin.reserveTokenA,
    }))
    .reverse()
    .map((bin, index) => ({ ...bin, index }));
};

export const getPoolSelectionGraphTooltipTick = (bin: Pick<PoolSelectionGraphBin, "minTick" | "maxTick">): number => {
  return bin.minTick;
};

export const getPoolSelectionGraphEmptyTickWindow = ({
  currentTick,
  visibleTickRange,
  minTick,
  maxTick,
  selectedMinTick,
  selectedMaxTick,
}: {
  currentTick: number;
  visibleTickRange: number;
  minTick: number;
  maxTick: number;
  selectedMinTick?: number;
  selectedMaxTick?: number;
}): PoolSelectionGraphTickWindow => {
  const fullRange = maxTick - minTick;
  const normalizedRange = Math.min(fullRange, Math.max(1, Math.trunc(visibleTickRange)));

  if (normalizedRange >= fullRange) {
    return { minTick, maxTick };
  }

  const clampWindow = (windowMinTick: number): PoolSelectionGraphTickWindow => {
    const minWindowTick = Math.max(minTick, Math.min(windowMinTick, maxTick - normalizedRange));
    return {
      minTick: minWindowTick,
      maxTick: minWindowTick + normalizedRange,
    };
  };

  const clampedCurrentTick = Math.min(maxTick, Math.max(minTick, currentTick));
  let tickWindow = clampWindow(clampedCurrentTick - Math.floor(normalizedRange / 2));

  if (selectedMinTick !== undefined && selectedMaxTick !== undefined) {
    const selectedRange = selectedMaxTick - selectedMinTick;

    if (selectedRange <= normalizedRange) {
      let nextMinTick = tickWindow.minTick;

      if (nextMinTick > selectedMinTick) {
        nextMinTick = selectedMinTick;
      }

      if (nextMinTick + normalizedRange < selectedMaxTick) {
        nextMinTick = selectedMaxTick - normalizedRange;
      }

      tickWindow = clampWindow(nextMinTick);
    }
  }

  return tickWindow;
};

export const normalizePoolSelectionGraphPriceRange = (
  startPrice: number,
  endPrice: number,
): PoolSelectionGraphPriceRange => ({
  minPrice: Math.min(startPrice, endPrice),
  maxPrice: Math.max(startPrice, endPrice),
});
