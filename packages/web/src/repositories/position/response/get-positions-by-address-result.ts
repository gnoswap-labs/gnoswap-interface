import { PositionModel } from "@models/position/position-model";

export interface GetPositionsByAddressResult {
  positions: PositionModel[];
  totalCount: number;
}
