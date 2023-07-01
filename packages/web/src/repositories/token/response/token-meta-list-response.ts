
export interface TokenMetaListResponse {
	tokens: Array<TokenMeta>;
}

export interface TokenMeta {
	token_id: string;
	name: string;
	symbol: string;
	denom: string;
	minimal_denom: string;
	decimals: number;
}
