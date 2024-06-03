import { PoolRPCModel } from "./pool-rpc-model";
import { PositionDetailRPCModel } from "./position-detail-rpc-model";

export interface PoolDetailRPCModel extends PoolRPCModel {
  positions: PositionDetailRPCModel[];
}
