import { PositionModel } from "@models/position/position-model";

export interface PositionRepository {
  getPositionsByAddress: (address: string) => Promise<PositionModel[]>;
}
