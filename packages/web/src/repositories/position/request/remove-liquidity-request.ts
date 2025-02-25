export interface RemoveLiquidityRequest {
  lpTokenIds: string[];

  calculatedLiquidity: string;

  tokenPaths: string[];

  caller: string;

  isGetWGNOT: boolean;

  deadline?: string;
}
