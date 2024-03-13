import { PositionModel } from "@models/position/position-model";

export interface ClaimAllRequest {
  positions: PositionModel[];

  recipient: string;
}
