import BigNumber from "bignumber.js";

export interface RemoveLiquidityRequest {
  lpTokenIds: string[];

  positionLiquidities: Record<string, BigNumber>;

  tokenPaths: string[];

  caller: string;

  isGetWGNOT: boolean;

  deadline?: string;
}
