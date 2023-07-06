import {
  LiquidityProvideOptions,
  StakedOptions,
} from "@common/values/data-constant";

export interface LiquidityModel {
  poolId: string;

  liquidityId: string;

  liquidityType: LiquidityProvideOptions;

  stakeType: StakedOptions;

  maxRate: number;

  minRate: number;

  feeRate: number;
}
