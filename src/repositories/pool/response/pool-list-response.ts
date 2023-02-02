export interface PoolListResponse {
	hits: number;
	total: number;
	pools: Array<PoolInfo>;
}

interface PoolInfo {
	pool_id: string;
	incentive_type: "INCENTIVZED" | "NON_INCENTIVZED" | "EXTERNAL_INCENTIVZED";
	fee_rate: number;
	liquidity: TokenPair;
	apr: number;
	volumn_24h: number;
	fees_24h: number;
	rewards: TokenPair;
}

interface TokenPair {
	total: number;
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
