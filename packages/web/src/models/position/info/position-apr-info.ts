import { RewardType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface PositionAPRInfo {
  token: TokenModel;
  tokenAmountOf7d: number;
  aprOf7d: number;
  rewardType: RewardType;
  accuReward1D: number;
  apr: number;
}
