import { TokenPairInfo } from "@models/token/token-pair-info";
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
  tokenPair: TokenPairInfo;
  inRange: boolean;
  minPrice: number;
  maxPrice: number;
  rewards: {
    swap: TokenPairInfo;
    staking: TokenPairInfo;
  };
  apr: TokenPairInfo;
}
