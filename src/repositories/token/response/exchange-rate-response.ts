export interface ExchangeRateResponse {
	token_id: string;
	rates: Array<ExchangeRate>;
}

interface ExchangeRate {
	token_id: string;
	rate: number;
}
