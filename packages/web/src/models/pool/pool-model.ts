import { IncentivizedOptions } from "@common/values";
import { TokenModel } from "@models/token/token-model";
import { PoolBinModel } from "./pool-bin-model";

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

  tvl: number;

  tvlChange: number;

  volume: number;

  volumeChange: number;

  totalVolume: number;

  fee: string;

  feeVolume: number;

  feeChange: number;

  apr: number | null;

  poolPath?: string;

  rewardTokens: TokenModel[];
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
  feeVolume: string;
  feeChange: string;
  currentTick: string;
  price: string;
  tokenABalance: string;
  tokenBBalance: string;
  tickSpacing: string;
  bins: IBin[];
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
  priceId: string;
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
  priceId: string;
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
