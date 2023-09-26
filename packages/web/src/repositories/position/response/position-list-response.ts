import { LPPositionModel } from "@models/position/lp-position-model";

export interface PositionListResponse {
  message: string;
  count: number;
  meta: {
    dateUpdatedRaw: number;
    block: number;
    ageRaw: number;
  };

  stakedPositions: LPPositionModel[];

  unstakedPositions: LPPositionModel[];
}
