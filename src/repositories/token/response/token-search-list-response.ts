export interface TokenSearchListResponse {
	hits: number;
	total: number;
	tokens: Array<TokenSearchInfoResponse>;
}

export interface TokenSearchInfoResponse {
	token_id: string;
	name: string;
	symbol: string;
	amount: {
		value: number;
		denom: string;
	};
}
