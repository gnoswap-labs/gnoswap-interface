import { INCENTIVE_TYPE } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import { PoolBinModel } from "./pool-bin-model";

export interface PoolModel {
  poolPath: string;
  tokenA: TokenModel;
  tokenB: TokenModel;
  tokenABalance: number;
  tokenBBalance: number;

  liquidity: string;
  price: number;
  currentTick: number;
  tickSpacing: number;
  priceRatio: IPoolPriceRatio;
  fee: string;

  incentiveType: INCENTIVE_TYPE;
  rewardTokens: TokenModel[];

  tvl: string;
  tvlChange: number;
  volume24h: number;
  volumeChange24h: number;
  allTimeVolumeUsd: string;
  feeUsd24h: number;
  rewards24hUsd: number;

  apr: string;
  stakingApr: string;
  feeApr: string;
  totalApr: number | string | null;
  //TODO Remove later
  id: string;
}

export const initialPool: PoolModel = {
  poolPath: "",
  tokenA: {
    chainId: "",
    createdAt: "",
    name: "",
    address: "",
    path: "",
    decimals: 4,
    symbol: "",
    logoURI: "",
    type: "native",
    priceID: "",
  },
  tokenB: {
    chainId: "",
    createdAt: "",
    name: "",
    address: "",
    path: "",
    decimals: 4,
    symbol: "",
    logoURI: "",
    type: "native",
    priceID: "",
  },
  incentiveType: "INCENTIVIZED",
  tvl: "0",
  tvlChange: 0,
  volume24h: 0,
  id: "",
  apr: "0",
  fee: "",
  feeUsd24h: 0,
  currentTick: 0,
  price: 0,
  tokenABalance: 0,
  tokenBBalance: 0,
  tickSpacing: 0,
  rewardTokens: [],
  totalApr: 0,
  liquidity: "",
  rewards24hUsd: 0,
  volumeChange24h: 0,
  feeApr: "",
  stakingApr: "",
  allTimeVolumeUsd: "",
  priceRatio: {
    "7d": [],
    "30d": [],
    all: [],
  },
};

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
