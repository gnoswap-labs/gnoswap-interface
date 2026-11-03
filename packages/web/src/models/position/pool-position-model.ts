import { SwapFeeTierType } from "@constants/option.constant";
import { PoolModel } from "@models/pool/pool-model";
import { PositionModel } from "./position-model";

export interface PoolPositionModel extends PositionModel {
  feeTier: SwapFeeTierType;
  pool: PoolModel;
}

/** Display amounts for cards, with the unconverted source retained for position actions. */
export interface DisplayPoolPositionModel extends PoolPositionModel {
  rawPosition: PoolPositionModel;
}
