import { BaseError } from "../base";

const ERROR_VALUE = {
	COIN_TYPE_ERROR: {
		status: 1000,
		type: "COIN_TYPE_ERROR",
	},
	NOT_FOUND_ADDRESS: {
		status: 1001,
		type: "NOT_FOUND_ADDRESS",
	},
	WALLET_CONNECT_FAILED: {
		status: 1002,
		type: "WALLET_CONNECT_FAILED",
	},
};

type ErrorType = keyof typeof ERROR_VALUE;

export class AccountError extends BaseError {
	constructor(errorType: ErrorType) {
		super(ERROR_VALUE[errorType]);
		Object.setPrototypeOf(this, AccountError.prototype);
	}
}
