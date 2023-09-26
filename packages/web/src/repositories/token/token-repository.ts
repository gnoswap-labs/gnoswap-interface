import { TokenSearchLogModel } from "@models/token/token-search-log-model";
import { TokenListResponse, TokenSearchLogListResponse } from "./response";
import { TokenPriceListResponse } from "./response/token-price-list-response";

export interface TokenRepository {
  getTokens: () => Promise<TokenListResponse>;

  getTokenPrices: () => Promise<TokenPriceListResponse>;

  createSearchLog: (searchLog: TokenSearchLogModel) => Promise<boolean>;

  getSearchLogs: () => Promise<TokenSearchLogListResponse>;

  clearSearchLogs: () => Promise<boolean>;
}
