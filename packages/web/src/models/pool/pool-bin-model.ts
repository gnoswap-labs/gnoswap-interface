export interface PoolBinModel {
  poolPath: string;

  currentTick: number;

  tokenAAmount: number;

  tokenBAmount: number;

  minTick: number;

  maxTick: number;

  liquidity: number;

  apr: number;
}
