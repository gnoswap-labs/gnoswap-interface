import { BaseError } from "../base";

const ERROR_VALUE = {
	COIN_TYPE_ERROR: {
		status: 1000,
		type: "Coin Type Error",
	},
	NOT_FOUND_ADDRESS: {
		status: 1001,
		type: "Not found Address",
	},
	WALLET_CONNECT_FAILED: {
		status: 1002,
		type: "Wallet Connect Failed",
	},
	NOT_FOUND_ACCOUNT: {
		status: 1003,
		type: "Not found Account",
	},
};

type ErrorType = keyof typeof ERROR_VALUE;

export class AccountError extends BaseError {
	constructor(errorType: ErrorType) {
		super(ERROR_VALUE[errorType]);
		Object.setPrototypeOf(this, AccountError.prototype);
	}
}
