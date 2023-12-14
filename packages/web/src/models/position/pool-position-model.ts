import { PoolModel } from "@models/pool/pool-model";
import { PositionModel } from "./position-model";

export interface PoolPositionModel extends PositionModel {
  pool: PoolModel;
}
