
export interface AccountInfoResponse {
	status: string;
	address: string;
	coins: string;
	publicKey: {
		"@type": string;
		value: string;
	};
	accountNumber: number;
	sequence: number;
	chainId: string;
}
