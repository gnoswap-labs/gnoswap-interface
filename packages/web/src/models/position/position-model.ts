import { PoolBinModel } from "@models/pool/pool-bin-model";
import { PoolModel } from "@models/pool/pool-model";

export interface PositionModel {
  id: string;

  nftId: string;

  balance: number;

  volume: number;

  volumeA: number;

  volumeB: number;

  feeAPR: number;

  feesA: number;

  feesAUSD: number;

  feesBUSD: number;

  feesB: number;

  fees: number;

  reserveA: number;

  reserveB: number;

  pool: PoolModel;

  bins: PoolBinModel[];
}
