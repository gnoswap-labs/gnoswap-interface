import { IncentivizedOptions } from "@common/values";
import { TokenModel } from "@models/token/token-model";
import { PoolBinModel } from "./pool-bin-model";
import { IPoolPriceRatio } from "./pool-price-ratio.model";

export interface PoolModel {
  id: string;

  path: string;

  incentivizedType: IncentivizedOptions;

  name: string;

  price: number;

  tokenA: TokenModel;

  tokenB: TokenModel;

  tokenABalance: number;

  tokenBBalance: number;
  
  tickSpacing: number;

  currentTick: number;

  bins: PoolBinModel[];

  bins40: PoolBinModel[];

  allTimeVolumeUsd: number;

  tvl: number;

  tvlChange: number;

  volume24h: number;

  volumeChange: number;

  totalVolume: number;

  feeUsd24h: number;

  fee: string;

  feeChange: number;

  apr: number | string | null;
  totalApr: number | string | null;

  poolPath?: string;

  rewardTokens: TokenModel[];

  feeApr?: any;

  stakingApr?: any;
}

export interface IPoolDetailResponse {
  poolPath: string;
  tokenA: ITokenA;
  tokenB: ITokenB;
  tvl: string;
  tvlChange: string;
  volume: string;
  volumeChange: string;
  totalVolume: string;
  apr: string;
  fee: string;
  feeUsd24h: string;
  feeChange: string;
  currentTick: string;
  price: string;
  tokenABalance: string;
  tokenBBalance: string;
  tickSpacing: string;
  bins: IBin[];
  priceRatio: IPoolPriceRatio;
}

export interface ITokenA {
  type: string;
  chainId: string;
  createdAt: string;
  name: string;
  path: string;
  decimals: number;
  symbol: string;
  logoURI: string;
  priceID: string;
}

export interface ITokenB {
  type: string;
  chainId: string;
  createdAt: string;
  name: string;
  path: string;
  decimals: number;
  symbol: string;
  logoURI: string;
  priceID: string;
}

export interface IBin {
  index: number;
  liquidity: string;
  reserveTokenA: string;
  reserveTokenB: string;
  minTick: string;
  maxTick: string;
  rewardTokens: TokenModel[];
}