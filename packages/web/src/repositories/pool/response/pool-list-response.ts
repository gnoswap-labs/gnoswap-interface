export interface PoolListResponse {
	hits: number;
	total: number;
	pools: Array<PoolListInfoResponse>;
}

export interface PoolListInfoResponse {
	pool_id: string;
	incentivized_type: "INCENTIVZED" | "NON_INCENTIVZED" | "EXTERNAL_INCENTIVZED";
	fee_rate: number;
	liquidity: TokenPair;
	apr: number;
	volume_24h: number;
	fees_24h: number;
	rewards: Array<TokenBalance>;
}

interface TokenPair {
	token0: TokenBalance;
	token1: TokenBalance;
}

interface TokenBalance {
	token_id: string;
	name: string;
	symbol: string;
	amount: {
		value: number;
		denom: string;
	};
}
