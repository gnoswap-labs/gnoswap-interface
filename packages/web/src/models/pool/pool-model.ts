import { TokenModel } from "@models/token/token-model";
import { PoolBinModel } from "./pool-bin-model";
import { AmountModel } from "@models/common/amount-model";

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

  topBin: PoolBinModel;

  tvl: AmountModel;

  tvlChange: number;

  volume: AmountModel;

  volumeChange: number;

  totalVolume: AmountModel;

  fee: number;

  feeVolume: number;

  feeChange: number;

  block: number;

  dateUpdatedRaw: number;

  apr: number;
}
