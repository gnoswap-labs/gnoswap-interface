export interface DecreaseLiquiditySuccessResponse {
  hash: string;
  tokenID: string;
  removedLiquidity: string;
  collectedTokenAFee: string;
  collectedTokenBFee: string;
  removedTokenAAmount: string;
  removedTokenBAmount: string;
  poolPath: string;
}

export interface DecreaseLiquidityFailedResponse {
  hash: string;
}