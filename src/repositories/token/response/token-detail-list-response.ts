export interface TokenDetailListResponse {
	tokens: Array<TokenDetailInfo>;
}

interface TokenDetailInfo {
	token_name: string;
	token_symbol: string;
	balance: number;
	usd_value: number;
}
