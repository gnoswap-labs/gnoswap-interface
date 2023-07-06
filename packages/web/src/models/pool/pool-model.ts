import { IncentivizedOptions } from "@common/values/data-constant";
import { TokenDefaultModel } from "@models/token/token-default-model";
import { TokenPairModel } from "@models/token/token-pair-model";

export interface PoolModel {
  poolId: string;

  feeRate: number;

  liquidity: TokenPairModel;

  rewards: Array<TokenDefaultModel>;

  incentivizedType: IncentivizedOptions;
}
