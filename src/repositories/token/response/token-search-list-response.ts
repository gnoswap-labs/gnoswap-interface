export interface TokenSearchListResponse {
	hits: number;
	total: number;
	tokens: Array<TokenSearchInfoResponse>;
}

interface TokenSearchInfoResponse {
	token_id: string;
	name: string;
	symbol: string;
	balance: {
		amount: number;
		denom: string;
	};
}
