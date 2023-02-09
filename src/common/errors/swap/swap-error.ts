import { BaseError } from "../base";

const ERROR_VALUE = {
	SYMBOL_TYPE_CHECK_ERROR: {
		status: 1000,
		type: "Token Symbol Data check Error",
	},
	AMOUNT_TYPE_CHECK_ERROR: {
		status: 1001,
		type: "Amount Data check Error",
	},
};

type ErrorType = keyof typeof ERROR_VALUE;

export class SwapError extends BaseError {
	constructor(errorType: ErrorType) {
		super(ERROR_VALUE[errorType]);
		Object.setPrototypeOf(this, SwapError.prototype);
	}
}
