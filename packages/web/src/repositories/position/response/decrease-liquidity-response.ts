export interface DecreaseLiquidityResponse {
  tokenID: string;

  removedLiquidity: string;

  collectedTokenAFee: string;

  collectedTokenBFee: string;

  removedTokenAAmount: string;

  removedTokenBAmount: string;

  poolPath: string;
}
