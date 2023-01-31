export interface LiquidityListResponse {
	liquidities: Array<LiquidityInfo>;
}

interface LiquidityInfo {
	token_pair_logo: Array<string>;
	token_pair_name: Array<string>;
	token_id: string;
	liquidity_id: string;
}
