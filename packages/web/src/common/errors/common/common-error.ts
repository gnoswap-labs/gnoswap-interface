import { BaseError } from "@common/errors";

const ERROR_VALUE = {
  FAILED_INITIALIZE_PROVIDER: {
    status: 400,
    type: "Failed to initialize Provider",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class CommonError extends BaseError {
  constructor(errorType: ErrorType) {
    super(ERROR_VALUE[errorType]);
    Object.setPrototypeOf(this, CommonError.prototype);
  }
}
