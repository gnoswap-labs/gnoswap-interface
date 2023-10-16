import { PoolBinModel } from "./pool-bin-model";
import { PoolModel } from "./pool-model";

export interface PoolDetailModel extends PoolModel {
  resolvedBins: PoolBinModel[];
}
