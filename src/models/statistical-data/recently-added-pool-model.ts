import { TokenPairModel } from "./../token/token-pair-model";
export interface RecentlyAddedPoolModel {
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
