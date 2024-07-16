export interface RepositionLiquiditySuccessResponse {
  tokenID: string;

  liquidity: string;

  minTick: number;

  maxTick: number;

  tokenAAmount: string;

  tokenBAmount: string;
}

export interface RepositionLiquidityFailedResponse {
  hash: string;
}
