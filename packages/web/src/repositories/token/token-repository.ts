import {
  TokenSearchItemType,
  TokenSearchListModel,
} from "@models/token/token-search-list-model";
import {
  TokenDatatableResponse,
  TokenInfoResponse,
  SummaryPopularTokenListResponse,
  SummaryHighestRewardListResponse,
  SummaryRecentlyAddedListResponse,
  TokenSearchListResponse,
  ExchangeRateResponse,
  TokenMetaListResponse,
  USDExchangeRateResponse,
} from "./response";

export interface TokenRepository {
  getAllTokenMetas: () => Promise<TokenMetaListResponse>;

  getTokenById: (tokenId: string) => Promise<TokenInfoResponse>;

  searchTokens: (keyword: string) => Promise<TokenSearchListResponse>;

  createSearchLog: (searchToken: TokenSearchItemType) => boolean;

  getSearchLogs: () => TokenSearchListModel;

  getAllExchangeRates: (tokenId: string) => Promise<ExchangeRateResponse>;

  getUSDExchangeRate: (tokenId: string) => Promise<USDExchangeRateResponse>;

  getTokenDatatable: () => Promise<TokenDatatableResponse>;

  getSummaryPopularTokens: () => Promise<SummaryPopularTokenListResponse>;

  getSummaryHighestRewardTokens: () => Promise<
    SummaryHighestRewardListResponse
  >;

  getSummaryRecentlyAddedTokens: () => Promise<
    SummaryRecentlyAddedListResponse
  >;
}
