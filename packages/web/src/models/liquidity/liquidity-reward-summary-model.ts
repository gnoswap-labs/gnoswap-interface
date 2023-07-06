import { TokenPairModel } from "@models/token/token-pair-model";
import { LiquidityRewardModel } from "./liquidity-reward-model";

export interface LiquidityRewardSummaryModel {
  poolId: string;
  isClaim: boolean;
  totalBalance: TokenPairModel;
  dailyEarning: TokenPairModel;
  reward: LiquidityRewardModel;
}
