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

  tokenAProtocolFee: number;

  tokenBProtocolFee: number;

  liquidity: bigint;

  ticks: number[];

  tickBitmaps: { [key in string]: string };

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
  cached: boolean;

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
