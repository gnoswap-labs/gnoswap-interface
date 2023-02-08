export interface TokenSearchListResponse {
	recentTokens: Array<TokenSearchItemResponse>;
	popularTokens: Array<TokenSearchItemResponse>;
}

export interface TokenSearchItemResponse {
	change_rate: number;
	token: {
		token_id: string;
		name: string;
		symbol: string;
		amount: {
			value: number;
			denom: string;
		};
	};
}
