import { TokenPairModel } from "./../token/token-pair-model";
export interface HighestRewardPoolModel {
	hits: number;
	total: number;
	pools: Array<SummaryPoolType>;
}

interface SummaryPoolType {
	pool_id: string;
	fee_tier: number;
	apr: number;
	token_pair: TokenPairModel;
}
