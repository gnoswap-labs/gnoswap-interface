export interface AccountInfoResposne {
	address: string;
	username: string;
	amount: {
		value: number;
		denom: string;
	};
}
