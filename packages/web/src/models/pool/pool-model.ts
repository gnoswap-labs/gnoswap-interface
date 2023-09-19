import { IncentivizedOptions } from "@common/values/data-constant";
import { TokenDefaultModel } from "@models/token/token-default-model";
import { TokenPairModel } from "@models/token/token-pair-model";
import { PoolSelectItemModel } from "./pool-select-item-model";

export interface PoolModel {
  poolId: string;

  feeRate: number;

  liquidity: TokenPairModel;

  rewards: Array<TokenDefaultModel>;

  incentivizedType: IncentivizedOptions;
}

export function mapPoolModelToSelectItem(pool: PoolModel): PoolSelectItemModel {
  const { poolId, liquidity, feeRate } = pool;
  return {
    poolId,
    tokenPair: liquidity,
    feeRate,
    liquidityAmount: "0",
  };
}
