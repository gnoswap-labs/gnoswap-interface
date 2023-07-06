import { BaseError } from "@common/errors";

const ERROR_VALUE = {
  SYMBOL_TYPE_CHECK_ERROR: {
    status: 1000,
    type: "Token Symbol Data check Error",
  },
  AMOUNT_TYPE_CHECK_ERROR: {
    status: 1001,
    type: "Amount Data check Error",
  },
  SWAP_RATE_LOOKUP_FAILED: {
    status: 4000,
    type: "Swap rate lookup failed",
  },
  EXPECTED_RESULT_LOOKUP_FAILED: {
    status: 4001,
    type: "Expected result lookup failed",
  },
  SWAP_FAILED: {
    status: 4002,
    type: "Swap failed",
  },
  SET_SLIPPAGE_FAILED: {
    status: 4003,
    type: "Set slippage failed",
  },
  GET_SLIPPAGE_FAILED: {
    status: 4004,
    type: "Get slippage failed",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class SwapError extends BaseError {
  constructor(errorType: ErrorType) {
    super(ERROR_VALUE[errorType]);
    Object.setPrototypeOf(this, SwapError.prototype);
  }
}
