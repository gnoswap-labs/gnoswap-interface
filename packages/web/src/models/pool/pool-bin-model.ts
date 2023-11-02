export interface PoolBinModel {
  binId: string;

  poolId: string;

  currentTick: number;

  reserveA: number;

  reserveB: number;

  totalSupply: number;

  lpTokenId: string;

  timestamp: string;

  annualizedFeeGrowth: number;
}
