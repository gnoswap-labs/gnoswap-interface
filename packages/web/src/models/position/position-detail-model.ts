import { PositionRewardModel } from "./position-reward-model";
import { PositionModel } from "./position-model";

export interface PositionDetailModel {
  apr: number;

  lpRewardId: string;

  position: PositionModel;

  rewards: PositionRewardModel[];
}
