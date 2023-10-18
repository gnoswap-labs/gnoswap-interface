import { BaseError } from "@common/errors";

const ERROR_VALUE = {
  AMOUNT_TYPE_CHECK_ERROR: {
    status: 4000,
    type: "Amount Data check Error",
  },
  NOT_FOUND_SWAP_POOL: {
    status: 4001,
    type: "Swap Pool not found",
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
  INVALID_PARAMS: {
    status: 5000,
    type: "Invalid request parameters",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class SwapError extends BaseError {
  constructor(errorType: ErrorType) {
    super(ERROR_VALUE[errorType]);
    Object.setPrototypeOf(this, SwapError.prototype);
  }
}
