export interface SwapRequest {
  tokenA: string;

  tokenB: string;

  fee: number;

  receiver: string; //address

  zeroForOne: boolean; // direction

  amountSpecified: number; // positive: token to spend, negative: token to receive

  sqrtPriceLimitX96: number; // current sqrtPriceX96 with slippage percent calculate
}
