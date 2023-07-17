import { TokenPairModel } from "@models/token/token-pair-model";
import { LiquidityModel } from "./liquidity-model";
import { LiquidityRewardModel } from "./liquidity-reward-model";

export interface LiquidityDetailModel extends LiquidityModel {
  inRange: boolean;
  liquidity: TokenPairModel;
  reward: LiquidityRewardModel;
  apr: TokenPairModel;
}
