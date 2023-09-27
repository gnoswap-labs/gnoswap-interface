import { PositionModel } from "./position-model";
import { PositionRewardModel } from "./position-reward-model";

export interface LPPositionModel {
  apr: number;

  lpRewardId: string;

  position: PositionModel;

  rewards: PositionRewardModel[];
}
