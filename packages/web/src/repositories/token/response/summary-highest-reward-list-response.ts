export interface SummaryHighestRewardListResponse {
	hits: number;
	total: number;
	pairs: Array<HighestRewardPairInfo>;
}

export interface HighestRewardPairInfo {
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
