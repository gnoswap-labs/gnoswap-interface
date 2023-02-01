export interface TokenListResponse {
	tokens: Array<TokenInfo>;
}

interface TokenInfo {
	token_name: string;
	token_symbol: string;
	token_type: string;
	current_price: number;
	price_of_1h: number;
	price_of_24h: number;
	price_of_7d: number;
	m_cap: number;
	tvl: number;
	volume: number;
	mostLiquidPool: LiquiditySimpleInfo;
	graph: Array<number>;
}

interface LiquiditySimpleInfo {
	logos: Array<string>;
	denoms: Array<string>;
	rate: string;
}
