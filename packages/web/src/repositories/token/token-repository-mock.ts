import {
  ExchangeRateResponse,
  TokenDatatableResponse,
  TokenRepository,
  TokenInfoResponse,
  SummaryHighestRewardListResponse,
  SummaryRecentlyAddedListResponse,
  SummaryPopularTokenListResponse,
  TokenSearchListResponse,
  TokenMetaListResponse,
  USDExchangeRateResponse,
} from ".";

import mockTokenInfos from "./mock/token-infos.json";
import mockTokenDatatable from "./mock/token-datatable.json";
import mockTokenMetas from "./mock/token-metas.json";
import mockExchangeRate from "./mock/exchange-rates.json";
import mockSummaryHighestRewards from "./mock/summary-highest-rewards.json";
import mockSummaryPopularTokens from "./mock/summary-popular-tokens.json";
import mockSummaryRecentAdded from "./mock/summary-recent-added.json";
import mockSearchTokens from "./mock/search-tokens.json";
import { StorageClient } from "@common/clients/storage-client";
import {
  TokenSearchItemType,
  TokenSearchListModel,
} from "@models/token/token-search-list-model";
import { StorageKeyType } from "@common/values";

export class TokenRepositoryMock implements TokenRepository {
  private localStorageClient: StorageClient<StorageKeyType>;

  constructor(localStorageClient: StorageClient<any>) {
    this.localStorageClient = localStorageClient;
  }

  public getAllTokenMetas = async (): Promise<TokenMetaListResponse> => {
    return mockTokenMetas;
  };

  public searchTokens = async (
    keyword: string,
  ): Promise<TokenSearchListResponse> => {
    if (keyword.length < 1) {
      return {
        items: mockSearchTokens.items.filter(
          item => item.search_type === "POPULAR_TOKEN",
        ),
      };
    }
    return {
      items: mockSearchTokens.items.filter(
        item => item.search_type !== "POPULAR_TOKEN",
      ),
    };
  };

  public createSearchLog = (searchToken: TokenSearchItemType) => {
    const LOG_LIMIT = 10;
    const searchLogs = [searchToken, ...this.getSearchLogItems()].slice(
      0,
      LOG_LIMIT,
    );
    this.localStorageClient.set(
      "search-token-logs",
      JSON.stringify(searchLogs),
    );
    return true;
  };

  public getSearchLogs = (): TokenSearchListModel => {
    const items = this.getSearchLogItems();
    return { items };
  };

  public getAllExchangeRates = async (
    tokenId: string,
  ): Promise<ExchangeRateResponse> => {
    return {
      token_id: tokenId,
      rates: mockExchangeRate.rates,
    };
  };

  public getUSDExchangeRate = async (): Promise<USDExchangeRateResponse> => {
    return {
      rate: 1.14,
    };
  };

  public getTokenDatatable = async (): Promise<TokenDatatableResponse> => {
    return mockTokenDatatable as TokenDatatableResponse;
  };

  public getSummaryPopularTokens = async (): Promise<
    SummaryPopularTokenListResponse
  > => {
    return mockSummaryPopularTokens;
  };

  public getSummaryHighestRewardTokens = async (): Promise<
    SummaryHighestRewardListResponse
  > => {
    return mockSummaryHighestRewards;
  };

  public getSummaryRecentlyAddedTokens = async (): Promise<
    SummaryRecentlyAddedListResponse
  > => {
    return mockSummaryRecentAdded;
  };

  public getTokenById = async (tokenId: string): Promise<TokenInfoResponse> => {
    const token = mockTokenInfos.tokens.find(
      token => token.token_id === tokenId,
    );
    if (!token) {
      throw new Error("Not found token");
    }
    return token;
  };

  public getSearchLogItems = (): Array<TokenSearchItemType> => {
    const logValue = this.localStorageClient.get("search-token-logs");
    if (!logValue) {
      return [];
    }

    let logs: Array<TokenSearchItemType> = [];
    try {
      logs = JSON.parse(logValue);
    } catch (e) {
      throw new Error("Invalid value");
    }
    return logs;
  };
}
