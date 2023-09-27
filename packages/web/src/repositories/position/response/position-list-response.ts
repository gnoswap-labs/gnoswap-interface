import { LPPositionModel } from "@models/position/lp-position-model";

export interface PositionListResponse {
  meta: {
    height: number;
    timestamp: string;
  };

  stakedPositions: LPPositionModel[];

  unstakedPositions: LPPositionModel[];
}
