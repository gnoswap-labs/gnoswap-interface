export interface PoolRPCResponse {
  poolPath: string;

  token0Path: string;

  token1Path: string;

  token0Balance: string;

  token1Balance: string;

  fee: number;

  tickSpacing: number;

  maxLiquidityPerTick: number;

  sqrtPriceX96: string;

  tick: number;

  feeProtocol: number;

  feeGrowthGlobal0X128: number;

  feeGrowthGlobal1X128: number;

  token0ProtocolFee: number;

  token1ProtocolFee: number;

  liquidity: string;

  ticks: {
    [key in number]: {
      liquidityGross: number;
      liquidityNet: number;
      feeGrowthOutside0X128: number;
      feeGrowthOutside1X128: number;
      tickCumulativeOutside: number;
      secondsPerLiquidityOutsideX: number;
      secondsOutside: number;
    };
  };

  tickBitmaps: { [key in number]: bigint };

  positions: {
    owner: string;
    tickLower: number;
    tickUpper: number;
    liquidity: string;
    token0Owed: string;
    token1Owed: string;
  }[];
}

export interface PoolListRPCResponse {
  stat: {
    height: number;
    timestamp: number;
  };
  response: {
    data: PoolRPCResponse[];
  };
}
