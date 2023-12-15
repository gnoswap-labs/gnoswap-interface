import { BaseError } from "@common/errors";

const ERROR_VALUE = {
  NOT_FOUND_POOL: {
    status: 404,
    type: "Not found pool",
  },
  FAILED_TO_CREATE_INCENTIVE: {
    status: 500,
    type: "Failed to create incentive",
  },
  FAILED_TO_REMOVE_INCENTIVE: {
    status: 500,
    type: "Failed to remove incentive",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class PoolError extends BaseError {
  constructor(errorType: ErrorType) {
    super(ERROR_VALUE[errorType]);
    Object.setPrototypeOf(this, PoolError.prototype);
  }
}
