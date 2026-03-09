import { PoolPositionModel } from "@models/position/pool-position-model";

export interface UnstakePositionsRequest {
  positions: PoolPositionModel[];

  caller: string;

  gasFee?: string;

  gasUsed?: string;
}
