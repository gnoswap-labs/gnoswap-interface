import { BaseError } from "@common/errors";

const ERROR_VALUE = {
  FAILED_PARSE_APPROVE_MESSAGE: {
    status: 400,
    type: "Failed to parse the approve message",
  },
  FAILED_BUILD_RUN_MESSAGE: {
    status: 400,
    type: "Failed to build the run message",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class TransactionMessageError extends BaseError {
  constructor(errorType: ErrorType, message?: unknown) {
    const errorMessage = `${ERROR_VALUE[errorType].type}: ${JSON.stringify(message || "")}`;

    super({ ...ERROR_VALUE[errorType], message: errorMessage });
    Object.setPrototypeOf(this, TransactionMessageError.prototype);
  }
}
