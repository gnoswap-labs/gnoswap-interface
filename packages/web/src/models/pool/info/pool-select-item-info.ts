import { PoolModel } from "@models/pool/pool-model";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";

export interface PoolSelectItemInfo {
  poolId: string;

  feeRate: number;

  liquidityAmount: string;

  tokenA: TokenModel;

  tokenB: TokenModel;
}

export function toPoolSelectItemInfo(pool: PoolModel): PoolSelectItemInfo {
  return {
    poolId: pool.id,
    liquidityAmount: BigNumber(pool.price).toFixed(),
    feeRate: pool.fee,
    tokenA: pool.tokenA,
    tokenB: pool.tokenB,
  };
}
