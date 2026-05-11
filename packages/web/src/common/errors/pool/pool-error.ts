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
  FAILED_TO_COLLECT_INCENTIVE: {
    status: 500,
    type: "Failed to collect incentive",
  },
  FAILED_TO_GET_LIQUIDITY: {
    status: 500,
    type: "Failed to get pool liquidity",
  },
  FAILED_TO_GET_TICKS: {
    status: 500,
    type: "Failed to get pool ticks",
  },
  FAILED_TO_GET_TICK_SPACING: {
    status: 500,
    type: "Failed to get pool tick spacing",
  },
  FAILED_TO_GET_SQRT_PRICE_X96: {
    status: 500,
    type: "Failed to get pool sqrt price x96",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class PoolError extends BaseError {
  constructor(errorType: ErrorType) {
    super(ERROR_VALUE[errorType]);
    Object.setPrototypeOf(this, PoolError.prototype);
  }
}
