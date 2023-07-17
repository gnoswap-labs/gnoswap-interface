import { BaseError } from "@common/errors";

const ERROR_VALUE = {
  COIN_TYPE_ERROR: {
    status: 1000,
    type: "Coin Type Error.",
  },
  HAS_NOT_NOTI: {
    status: 1001,
    type: "Has not notification.",
  },
  FAILED_NOTI_CREATE: {
    status: 1002,
    type: "Failed to create notification.",
  },
  FAILED_NOTI_STATUS_UPDATE: {
    status: 1003,
    type: "Failed to updated notification status.",
  },
  FAILED_DILETE_ALL_NOTI: {
    status: 1004,
    type: "Failed to delete all notification.",
  },
  NOT_FOUNT_ADDRESS: {
    status: 3002,
    type: "Not found Address.",
  },
  CONNECTION_REJECTED: {
    status: 4000,
    type: "Connection Rejected.",
  },
  CONNECT_UNKNOWN_ERROR: {
    status: 4001,
    type: "Unknown error in wallet connection.",
  },
  CONNECT_TRY_AGAIN: {
    status: 4002,
    type: "Connection attempt has failed. Click try again.",
  },
  NOT_EXIST_ADENA_WALLET: {
    status: 5000,
    type: "Not exist adena wallet.",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class AccountError extends BaseError {
  constructor(errorType: ErrorType) {
    super(ERROR_VALUE[errorType]);
    Object.setPrototypeOf(this, AccountError.prototype);
  }
}
