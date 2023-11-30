import { TokenModel } from "@models/token/token-model";
import { PoolBinModel } from "./pool-bin-model";

export interface PoolModel {
  id: string;

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

  apr: number;
}
