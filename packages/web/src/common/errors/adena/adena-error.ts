import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { BaseError } from "@common/errors";

const ERROR_VALUE = {
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
  SIGN_REJECTED: {
    status: 4000,
    type: "SIGN_REJECTED",
  },
  CONNECTION_REJECTED: {
    status: 4000,
    type: "CONNECTION_REJECTED",
  },
  SWITCH_NETWORK_REJECTED: {
    status: 4000,
    type: "SWITCH_NETWORK_REJECTED",
  },
  ADD_NETWORK_REJECTED: {
    status: 4000,
    type: "ADD_NETWORK_REJECTED",
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
  NETWORK_TIMEOUT: {
    status: 4001,
    type: "NETWORK_TIMEOUT",
  },
  REDUNDANT_CHANGE_REQUEST: {
    status: 4001,
    type: "REDUNDANT_CHANGE_REQUEST",
  },
  NETWORK_ALREADY_EXISTS: {
    status: 4001,
    type: "NETWORK_ALREADY_EXISTS",
  },
  UNADDED_NETWORK: {
    status: 4001,
    type: "UNADDED_NETWORK",
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

  public static valdiate(response: WalletResponse) {
    const errorType = Object.keys(ERROR_VALUE).find(
      errorType =>
        ERROR_VALUE[errorType as ErrorType].status === response.code &&
        ERROR_VALUE[errorType as ErrorType].type === response.type,
    );

    if (errorType) {
      throw new AdenaError(errorType as ErrorType);
    }
  }
}
