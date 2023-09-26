import { PositionDetailModel } from "@models/position/position-detail-model";

export interface PositionDetailResponse {
  message: string;
  count: number;
  meta: {
    dateUpdatedRaw: number;
    block: number;
    ageRaw: number;
  };

  position: PositionDetailModel;
}
