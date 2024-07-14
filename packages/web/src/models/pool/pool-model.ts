import { INCENTIVE_TYPE } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import { PoolBinModel } from "./pool-bin-model";

export interface PoolModel {
  rewards24hUsd: number;

  volumeChange24h: number;

  incentiveType: INCENTIVE_TYPE;

  price: number;

  tokenA: TokenModel;

  tokenB: TokenModel;

  tokenABalance: number;

  tokenBBalance: number;

  tickSpacing: number;

  currentTick: number;

  tvl: string;

  tvlChange: number;

  volume24h: number;

  feeUsd24h: number;

  fee: string;

  apr: string;

  totalApr: number | string | null;

  poolPath: string;

  rewardTokens: TokenModel[];

  feeApr: string;

  stakingApr: string;

  allTimeVolumeUsd: string;

  priceRatio: IPoolPriceRatio;

  liquidity: string;

  //TODO Remove later
  id: string;
}

export interface IncentivizePoolModel extends PoolModel {
  bins40: PoolBinModel[];
}

export interface IPoolDetailResponse {
  poolPath: string;
  tokenA: ITokenA;
  tokenB: ITokenB;
  tvl: string;
  tvlChange: string;
  volume: string;
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

export interface IPoolPriceRatioItem {
  date: string;
  ratio: string;
}

export interface IPoolPriceRatio {
  "7d": IPoolPriceRatioItem[];
  "30d": IPoolPriceRatioItem[];
  all: IPoolPriceRatioItem[];
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
