import { LiquidityProvideOptions } from "@common/values/data-constant";
import { TokenPairModel } from "@models/token/token-pair-model";
import { FeeOptions, StakedOptions } from "@common/values";

export interface PoolPositionModel {
  hits: number;
  total: number;
  pools: Array<PoolPositionType>;
}

interface PoolPositionType {
  poolId: string;
  liquidityId: string;
  liquidityType: LiquidityProvideOptions;
  poolPosition: PoolPairPositionType;
  currentPool: CurrentPoolType;
  rateGraph: RangeGraphType;
  priceGraph: PriceGraphType;
}

interface PoolPairPositionType {
  tokenPair: TokenPairModel;
  feeRate: FeeOptions;
  stakeType: StakedOptions;
}

interface RangeGraphType {
  maxRate: FeeOptions;
  minRate: FeeOptions;
}

interface PriceGraphType {
  tick: number;
  value: number;
}

interface CurrentPoolType {
  liquidityId: string;
  inRange: boolean;
  tokenPair: TokenPairModel;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
}
