import { TokenPairModel } from "@models/token/token-pair-model";

export interface PoolSelectItemModel {
  poolId: string;

  feeRate: number;

  liquidityAmount: string;

  tokenPair: TokenPairModel;
}
