export interface TokenSearchListResponse {
	items: Array<TokenSearchItemResponse>;
}

interface TokenSearchItemResponse {
	search_type: string;
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
