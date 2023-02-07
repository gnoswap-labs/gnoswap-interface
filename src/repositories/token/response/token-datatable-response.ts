export interface TokenDatatableResponse {
	hits: number;
	total: number;
	tokens: Array<TokenTableData>;
}

interface TokenTableData {
	name: string;
	type: "NATIVE" | "GRC20";
	symbol: string;
	price: number;
	price_of_1h: number;
	price_of_24h: number;
	price_of_7d: number;
	m_cap: number;
	tvl: number;
	volume: number;
	most_liquidity_pool: MostLiquidityPoolInfo;
	graph: Array<number>;
}

interface MostLiquidityPoolInfo {
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
