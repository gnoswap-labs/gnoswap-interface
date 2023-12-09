import { TokenSearchLogModel } from "@models/token/token-search-log-model";
import { IChainResponse, ITokenDetailResponse, TokenListResponse, TokenPriceListResponse, TokenSearchLogListResponse } from "./response";

export interface TokenRepository {
  getTokens: () => Promise<TokenListResponse>;

  getTokenPrices: () => Promise<TokenPriceListResponse>;
  
  getTokenDetailByPath: (path: string) => Promise<ITokenDetailResponse>;

  createSearchLog: (searchLog: TokenSearchLogModel) => Promise<boolean>;

  getSearchLogs: () => Promise<TokenSearchLogListResponse>;

  clearSearchLogs: () => Promise<boolean>;

  getChain: () => Promise<IChainResponse>;
}
