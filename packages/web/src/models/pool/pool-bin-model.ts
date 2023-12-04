export interface PoolBinModel {
  index: number;

  liquidity: number;

  reserveTokenA: number;

  reserveTokenB: number;

  currentTick?: number;

  minTick: number;

  maxTick: number;

  minTickPrice?: string;

  maxTickPrice?: string;

  reverseMinTickPrice?: string;

  reverseMaxTickPrice?: string;
}
