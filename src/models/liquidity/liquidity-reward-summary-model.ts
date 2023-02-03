import { TokenPairModel } from "../token/token-pair-model";
import { LiquidityRewardModel } from "./liquidity-reward-model";

export interface LiquidityRewardSummaryModel {
	liquidityId: string;
	isClaim: boolean;
	totalBalance: TokenPairModel;
	dailyEarning: TokenPairModel;
	reward: LiquidityRewardModel;
}
