export interface PoolInfoModel {
  poolPath: string;

  tokenABalance: number;

  tokenBBalance: number;

  tickSpacing: number;

  maxLiquidityPerTick: number;

  price: number;

  sqrtPriceX96: number;

  tick: number;

  feeProtocol: number;

  feeGrowthGlobal0X128: number;

  feeGrowthGlobal1X128: number;

  tokenAProtocolFee: number;

  tokenBProtocolFee: number;

  liquidity: number;

  ticks: number[];

  tickBitmaps: number[];

  positions: [
    {
      owner: string;

      tickLower: number;

      tickUpper: number;

      liquidity: number;

      tokenAOwed: number;

      tokenBOwed: number;
    },
  ];
}
