import { TokenPairModel } from "@models/token/token-pair-model";

export interface LiquidityRewardModel {
  swap: TokenPairModel;
  staking: TokenPairModel;
}
