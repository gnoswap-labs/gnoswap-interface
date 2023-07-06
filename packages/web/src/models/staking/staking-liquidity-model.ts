import { TokenPairModel } from "@models/token/token-pair-model";
import {
  LiquidityProvideOptions,
  StakedOptions,
} from "@common/values/data-constant";

export interface StakingLiquidityModel {
  stakingLiquidities: Array<StakingLiquidityType>;
}

interface StakingLiquidityType {
  poolId: string;
  liquidityId: string;
  liquidityType: LiquidityProvideOptions;
  stakeType: StakedOptions;
  tokenPair: TokenPairModel;
  inRange: boolean;
  minPrice: number;
  maxPrice: number;
  rewards: {
    swap: TokenPairModel;
    staking: TokenPairModel;
  };
  apr: TokenPairModel;
}
