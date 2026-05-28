import { PoolLiquiditySegmentModel } from "@models/pool/pool-liquidity-model";

export interface PoolSelectionGraphBin {
  index: number;
  height: number;
  minTick: number;
  maxTick: number;
  reserveTokenA: number;
  reserveTokenB: number;
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
