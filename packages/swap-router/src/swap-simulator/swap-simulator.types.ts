export interface Pool {
  poolPath: string;

  tokenAPath: string;

  tokenBPath: string;

  fee: number;

  tokenABalance: bigint;

  tokenBBalance: bigint;

  tickSpacing: number;

  maxLiquidityPerTick: number;

  price: number;

  sqrtPriceX96: bigint;

  tick: number;

  feeProtocol: number;

  feeGrowthGlobal0X128: number;

  feeGrowthGlobal1X128: number;

  tokenAProtocolFee: number;

  tokenBProtocolFee: number;

  liquidity: bigint;

  ticks: number[];

  tickBitmaps: { [key in number]: string };

  positions: Position[];
}

export interface Position {
  owner: string;

  tickLower: number;

  tickUpper: number;

  liquidity: bigint;

  tokenAOwed: bigint;

  tokenBOwed: bigint;
}

export interface SwapResult {
  amountA: bigint;

  amountB: bigint;

  quotes: {
    tick0: number;

    tick1: number;

    amountIn: bigint;

    amountOut: bigint;

    rate: number;
  }[];
}
