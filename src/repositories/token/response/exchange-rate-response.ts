export interface ExchangeRateResponse {
	token_id: string;
	rates: Array<ExchangeRate>;
}

export interface ExchangeRate {
	token_id: string;
	rate: number;
}
