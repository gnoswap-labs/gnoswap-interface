export interface DecreaseLiquidityReqeust {
  lpTokenId: string;

  liquidity: string;

  amountAMin: string;

  amountBMin: string;

  deadline?: string;

  caller: string;
}
