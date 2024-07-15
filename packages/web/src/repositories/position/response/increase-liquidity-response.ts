export interface IncreaseLiquiditySuccessResponse {
  hash: string;
  tokenID: string;
  liquidity: string;
  tokenAAmount: string;
  tokenBAmount: string;
  poolPath: string;
}

export interface IncreaseLiquidityFailedResponse {
  hash: string;
}