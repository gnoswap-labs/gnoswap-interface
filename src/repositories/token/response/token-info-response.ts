export interface TokenInfoResponse {
	name: string;
	symbol: string;
	balance: {
		amount: number;
		denom: string;
	};
}
