import {
  TokenRepository,
  TokenSearchLogListResponse,
  TokenListResponse,
  TokenPriceListResponse,
  ITokenDetailResponse,
  IChainResponse,
} from ".";

import { StorageKeyType } from "@common/values";
import { TokenSearchLogModel } from "@models/token/token-search-log-model";
import { StorageClient } from "@common/clients/storage-client";
import { NetworkClient } from "@common/clients/network-client";

export class TokenRepositoryImpl implements TokenRepository {
  private networkClient: NetworkClient;
  private localStorageClient: StorageClient<StorageKeyType>;

  constructor(
    networkClient: NetworkClient,
    localStorageClient: StorageClient<StorageKeyType>,
  ) {
    this.networkClient = networkClient;
    this.localStorageClient = localStorageClient;
  }

  public getTokens = async (): Promise<TokenListResponse> => {
    const response = await this.networkClient.get<TokenListResponse>({
      url: "/tokens",
    });
    if (response.data.tokens === null) {
      return { tokens: [] };
    }
    const tokens = response?.data?.tokens || [];
    return { tokens };
  };

  public getTokenPrices = async (): Promise<TokenPriceListResponse> => {
    const response = await this.networkClient.get<TokenPriceListResponse>({
      url: "/token_prices",
    });
    return response.data;
  };

  public getTokenDetailByPath = async (path: string): Promise<ITokenDetailResponse> => {
    const response = await this.networkClient.get<ITokenDetailResponse>({
      url: `/token_details/${path}`,
    });
    return response.data;
  };

  public getChain = async (): Promise<IChainResponse> => {
    const response = await this.networkClient.get<IChainResponse>({
      url: "/chain",
    });
    return response.data;
  };

  public createSearchLog = async (
    searchLog: TokenSearchLogModel,
  ): Promise<boolean> => {
    const LOG_LIMIT = 10;
    const searchLogs = await this.getSearchLogs();
    const addedSearchLogs = [searchLog, ...searchLogs].slice(0, LOG_LIMIT);
    this.localStorageClient.set(
      "search-token-logs",
      JSON.stringify(addedSearchLogs),
    );
    return true;
  };

  public getSearchLogs = async (): Promise<TokenSearchLogListResponse> => {
    const logValue = this.localStorageClient.get("search-token-logs");
    if (!logValue) {
      return [];
    }

    let logs: TokenSearchLogModel[] = [];
    try {
      logs = JSON.parse(logValue);
    } catch (e) {
      throw new Error("Invalid value");
    }
    return logs;
  };

  public clearSearchLogs = async (): Promise<boolean> => {
    await this.localStorageClient.remove("search-token-logs");
    return true;
  };
}
