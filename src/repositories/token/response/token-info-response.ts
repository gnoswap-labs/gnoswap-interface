export interface TokenInfoResponse {
	logo: string;
	name: string;
	symbol: string;
	amount: {
		value: number;
		denom: string;
	};
}
