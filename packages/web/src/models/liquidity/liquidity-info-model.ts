import {
  LiquidityProvideOptions,
  StakedOptions,
} from "@common/values/data-constant";
import { TokenPairModel } from "@models/token/token-pair-model";

export interface LiquidityInfoModel {
  liquidityId: string;

  tokenPair: TokenPairModel;

  liquidityType: LiquidityProvideOptions;

  stakeType: StakedOptions;

  maxRate: number;

  minRate: number;

  feeRate: number;

  amount: string;

  fee: TokenPairModel;
}
