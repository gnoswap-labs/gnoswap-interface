import { TokenModel } from "@models/token/token-model";

export interface PoolSelectItemInfo {
  poolId: string;

  feeRate: string;

  liquidityAmount: string;

  tokenA: TokenModel;

  tokenB: TokenModel;
}
