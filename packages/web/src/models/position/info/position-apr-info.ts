import { RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface PositionAPRInfo {
  token: TokenModel;
  rewardType: RewardType;
  accuReward1D: number | null;
  accuReward1DPrice: number | null;
  apr: number | null;
}
