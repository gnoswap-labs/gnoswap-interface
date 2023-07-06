import { BaseError } from "@common/errors";

const ERROR_VALUE = {
  NOT_FOUND_LIQUIDITY: {
    status: 404,
    type: "Not found liquidity",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class LiquidityError extends BaseError {
  constructor(errorType: ErrorType) {
    super(ERROR_VALUE[errorType]);
    Object.setPrototypeOf(this, LiquidityError.prototype);
  }
}
