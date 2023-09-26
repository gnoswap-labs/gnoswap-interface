export interface PoolBinModel {
  binId: string;

  poolId: string;

  currentTick: number;

  reserveA: number;

  reserveB: number;

  lpTokenId: string;

  timestamp: number;

  annualizedFeeGrowth: number;
}
