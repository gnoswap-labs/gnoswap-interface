import { InjectResponse } from "@common/clients/wallet-client/protocols";
import { BaseError } from "@common/errors";

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
  NOT_FOUND_ACCOUNT: {
    status: 1003,
    type: "NOT_FOUND_ACCOUNT",
  },
  NOT_CONNECTED: {
    status: 1000,
    type: "NOT_CONNECTED",
  },
  UNRESOLVED_TRANSACTION_EXISTS: {
    status: 1001,
    type: "UNRESOLVED_TRANSACTION_EXISTS",
  },
  INVALID_FORMAT: {
    status: 1002,
    type: "INVALID_FORMAT",
  },
  WALLET_LOCKED: {
    status: 2000,
    type: "WALLET_LOCKED",
  },
  UNUSED_ACCOUNT: {
    status: 3000,
    type: "UNUSED_ACCOUNT",
  },
  ACCOUNT_MISMATCH: {
    status: 3001,
    type: "ACCOUNT_MISMATCH",
  },
  NO_ACCOUNT: {
    status: 3002,
    type: "NO_ACCOUNT",
  },
  TRANSACTION_REJECTED: {
    status: 4000,
    type: "TRANSACTION_REJECTED",
  },
  CONNECTION_REJECTED: {
    status: 4000,
    type: "CONNECTION_REJECTED",
  },
  SIGN_REJECTED: {
    status: 4000,
    type: "SIGN_REJECTED",
  },
  TRANSACTION_FAILED: {
    status: 4001,
    type: "TRANSACTION_FAILED",
  },
  SIGN_FAILED: {
    status: 4001,
    type: "SIGN_FAILED",
  },
  ALREADY_CONNECTED: {
    status: 4001,
    type: "ALREADY_CONNECTED",
  },
  UNSUPPORTED_TYPE: {
    status: 4005,
    type: "UNSUPPORTED_TYPE",
  },
  UNEXPECTED_ERROR: {
    status: 9000,
    type: "UNEXPECTED_ERROR",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class AdenaError extends BaseError {
  constructor(errorType: ErrorType) {
    super(ERROR_VALUE[errorType]);
    Object.setPrototypeOf(this, AdenaError.prototype);
  }

  public static valdiate(injectResponse: InjectResponse<any>) {
    const errorType = Object.keys(ERROR_VALUE).find(
      errorType =>
        ERROR_VALUE[errorType as ErrorType].status === injectResponse.code &&
        ERROR_VALUE[errorType as ErrorType].type === injectResponse.type,
    );

    if (errorType) {
      throw new AdenaError(errorType as ErrorType);
    }
  }
}
