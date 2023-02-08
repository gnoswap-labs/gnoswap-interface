import { TokenPairModel } from "./../token/token-pair-model";
export interface HighestRewardPoolModel {
	hits: number;
	total: number;
	pairs: Array<SummaryHighestPairType>;
}

export interface SummaryHighestPairType {
	feeTier: number;
	apr: number;
	tokenPair: TokenPairModel;
}
