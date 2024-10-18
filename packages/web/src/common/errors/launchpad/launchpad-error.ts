import { BaseError } from "../base";

const ERROR_VALUE = {
  NOT_FOUND_PROJECT: {
    status: 404,
    type: "Not found project",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class LaunchpadError extends BaseError {
  constructor(errorType: ErrorType) {
    super(ERROR_VALUE[errorType]);
    Object.setPrototypeOf(this, LaunchpadError.prototype);
  }
}
