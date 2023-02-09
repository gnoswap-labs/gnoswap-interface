export interface SummaryRecentlyAddedListResponse {
	hits: number;
	total: number;
	pairs: Array<RecentlyAddedPairInfo>;
}

export interface RecentlyAddedPairInfo {
	pool_id: string;
	token0: {
		token_id: string;
		name: string;
		symbol: string;
	};
	token1: {
		token_id: string;
		name: string;
		symbol: string;
	};
	fee_tier: number;
	apr: number;
}
