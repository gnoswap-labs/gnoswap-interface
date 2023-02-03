import { TokenPairModel } from "./../token/token-pair-model";
export interface HighestRewardPoolModel {
	hits: number;
	total: number;
	pools: Array<SummaryPoolType>;
}

interface SummaryPoolType {
	poolId: string;
	feeTier: number;
	apr: number;
	tokenPair: TokenPairModel;
}
