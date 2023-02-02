import { TokenPairModel } from "./../token/token-pair-model";
export interface TokenTableModel {
	hits: number;
	total: number;
	tokens: Array<TokenDetailType>;
}

interface TokenDetailType {
	token_id: string;
	name: string;
	symbol: string;
	type: string;
	price: number;
	price_of_1h: number;
	price_of_24h: number;
	price_of_7d: number;
	m_cap: number;
	tvl: number;
	volume: number;
	most_liquidity_pool: MostLiquidityPoolType;
	graph: Array<number>;
}

interface MostLiquidityPoolType {
	fee_tier: number;
	apr: number;
	token_pair: TokenPairModel;
}
