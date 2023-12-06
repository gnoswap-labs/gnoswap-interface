import { PositionRPCModel } from "./position-rpc-model";

export interface PositionDetailRPCModel extends PositionRPCModel {
  liquidityOfTick: number;
}
