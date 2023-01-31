export interface LpTokenListResponse {
	liquidities: Array<LpTokenInfo>;
}

interface LpTokenInfo {
	liquidity_id: string;

	logo: string;

	liquidity: number;
}
