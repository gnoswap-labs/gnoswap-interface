import { TokenPairModel } from "../token/token-pair-model";

export interface LiquidityRewardModel {
	swap: TokenPairModel;
	staking: TokenPairModel;
}
