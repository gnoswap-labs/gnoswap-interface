import { BaseError } from "@common/errors";

const ERROR_VALUE = {
  NOT_FOUND_TOKEN_METAS: {
    status: 4000,
    type: "Unable to get all token metas.",
  },
  NO_MATCH_TOKENID_FOR_EX_RATE: {
    status: 4001,
    type: "Unable to retrieve all exchange rates for this token ID.",
  },
  NO_MATCH_TOKENID_FOR_USD_RATE: {
    status: 4002,
    type: "Unable to retrieve all USD rates for this token ID.",
  },
  NO_MATCH_TOKENID: {
    status: 4003,
    type: "Unable to tokens for this token ID.",
  },
  NO_SEARCH_TOKEN: {
    status: 4004,
    type: "No Search Data",
  },
  NO_TOKEN_DATATABLE_TYPE_ALL: {
    status: 5000,
    type: "No data found for token data table with type ALL",
  },
  NO_TOKEN_DATATABLE_TYPE_GRC20: {
    status: 5001,
    type: "No data found for token data table with type GRC20",
  },
  NO_SEARCH_TOKEN_DATATABLE: {
    status: 5002,
    type: "No Search Token Datatable",
  },
  NOT_FOUND_POPULAR_TOKENS: {
    status: 5003,
    type: "Not found Popular tokens",
  },
  NOT_FOUND_HIGHEST_TOKENS: {
    status: 5004,
    type: "Not found Highest reward tokens",
  },
  NOT_FOUND_RECENTLY_TOKENS: {
    status: 5005,
    type: "Not found Recently tokens",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class TokenError extends BaseError {
  constructor(errorType: ErrorType) {
    super(ERROR_VALUE[errorType]);
    Object.setPrototypeOf(this, TokenError.prototype);
  }
}
