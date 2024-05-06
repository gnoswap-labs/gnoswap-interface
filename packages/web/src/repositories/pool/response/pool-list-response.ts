import { PoolBinModel } from "@models/pool/pool-bin-model";
import { IPoolPriceRatio } from "@models/pool/pool-price-ratio.model";
import { TokenModel } from "@models/token/token-model";

export interface PoolListResponse {
  meta: {
    height: number;
    timestamp: string;
  };
  data: PoolResponse[];
}
export interface PoolResponse {
  id?: string;

  poolPath: string;

  incentiveType?: string;

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

  tvl: number;

  tvlChange: number;

  volume24h: number;

  volumeChange: number;

  totalVolume: number;

  fee: string;

  feeUsd24h: number;

  feeChange: number;

  apr: string;

  totalApr: string | number | null;

  rewardTokens?: TokenModel[];

  priceRatio: IPoolPriceRatio;
}

