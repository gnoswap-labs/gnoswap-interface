export interface DecreaseLiquidityReqeust {
  lpTokenId: string;

  liquidity: string;

  amountAMin: string;

  amountBMax: string;

  deadline?: string;

  caller: string;
}
