import { TokenSearchLogModel } from "@models/token/token-search-log-model";
import { IChainResponse, ITokenDetailResponse, ITokenResponse, TokenListResponse, TokenPriceListResponse, TokenSearchLogListResponse } from "./response";

export interface TokenRepository {
  getTokens: () => Promise<TokenListResponse>;

  getTokenByPath: (path: string) => Promise<ITokenResponse>;

  getTokenPrices: () => Promise<TokenPriceListResponse>;
  
  getTokenDetailByPath: (path: string) => Promise<ITokenDetailResponse>;

  createSearchLog: (searchLog: TokenSearchLogModel) => Promise<boolean>;

  getSearchLogs: () => Promise<TokenSearchLogListResponse>;

  clearSearchLogs: () => Promise<boolean>;

  getChain: () => Promise<IChainResponse>;
}
