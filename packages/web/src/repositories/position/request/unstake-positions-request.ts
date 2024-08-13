import { PoolPositionModel } from "@models/position/pool-position-model";

export interface UnstakePositionsRequest {
  positions: PoolPositionModel[];
  isGetWGNOT: boolean;

  caller: string;
}
