export interface PoolSummaryLiquidityResposne {
	liquidity: TokenPair;
	pooled_rate_token0: number;
	pooled_rate_token1: number;
	changed_of_24h: number;
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
