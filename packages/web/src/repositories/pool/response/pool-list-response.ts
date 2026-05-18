import { PoolBinModel } from "@models/pool/pool-bin-model";
import { IPoolPriceRatio } from "@models/pool/pool-model";
import { RewardTokenModel } from "@models/position/reward-model";
import { TokenModel } from "@models/token/token-model";

export interface PoolListResponse {
  meta: {
    height: number;
    timestamp: string;
  };
  data: PoolResponse[];
}
export interface PoolResponse {
  poolPath: string;

  incentivized: boolean;

  hasStakedPosition: boolean;

  price: number;

  tokenA: TokenModel;

  tokenB: TokenModel;

  tokenABalance: number;

  tokenBBalance: number;

  tickSpacing: number;

  currentTick: number;

  bins: PoolBinModel[]; // ToDo: Delete

  bins40: PoolBinModel[]; // ToDo: Delete

  tvl: string;

  tvlChange: number;

  volume24h: number;

  fee: string;

  feeUsd24h: number;

  apr: number;

  totalApr: string;

  rewardTokens?: RewardTokenModel[];

  priceRatio: IPoolPriceRatio;

  liquidity: string;

  allTimeVolumeUsd: string;

  volumeChange24h: number;

  rewards24hUsd: number;

  feeApr: string;

  stakingApr: string;

  // TODO Remove later

  id?: string;
}
