import {
  TokenRepository,
  TokenSearchLogListResponse,
  TokenListResponse,
  TokenPriceListResponse,
  ITokenDetailResponse,
  IChainResponse,
  ITokenResponse,
} from ".";

import { StorageKeyType } from "@common/values";
import { TokenSearchLogModel } from "@models/token/token-search-log-model";
import { StorageClient } from "@common/clients/storage-client";
import { NetworkClient } from "@common/clients/network-client";
import { IBalancesByAddressResponse } from "./response/balance-by-address-response";
import { customSort } from "@containers/select-token-container/SelectTokenContainer";
import mockedExchangeRateGraph from "./mock/token-exchange-rate-graph.json";
import { TokenExchangeRateGraphResponse } from "./response/token-exchange-rate-response";
import { CommonError } from "@common/errors";
import { TokenPriceModel } from "@models/token/token-price-model";

export class TokenRepositoryImpl implements TokenRepository {
  private networkClient: NetworkClient | null;
  private localStorageClient: StorageClient<StorageKeyType>;

  constructor(
    networkClient: NetworkClient | null,
    localStorageClient: StorageClient<StorageKeyType>,
  ) {
    this.networkClient = networkClient;
    this.localStorageClient = localStorageClient;
  }

  public getExchangeRateGraph =
    async (): Promise<TokenExchangeRateGraphResponse> => {
      return mockedExchangeRateGraph;
    };

  public getTokenByPath = async (path: string): Promise<ITokenResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const tempPath = path.replace(/\//g, "%2F");
    const response = await this.networkClient.get<{ data: ITokenResponse }>({
      url: `/token-metas/${tempPath}`,
    });
    return response.data.data;
  };

  public getTokens = async (): Promise<TokenListResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const response = await this.networkClient.get<{ data: ITokenResponse[] }>({
      url: "/token-metas",
    });
    if (response.data.data === null) {
      return { tokens: [] };
    }
    const tokens = response?.data?.data.sort(customSort) || [];
    return { tokens };
  };

  public getTokenPrices = async (): Promise<TokenPriceListResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const response = await this.networkClient.get<TokenPriceListResponse>({
      url: "/tokens/prices",
    });
    return response.data;
  };

  public getTokenPricesByPath = async (path: string): Promise<TokenPriceModel> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const response = await this.networkClient.get<{ data: TokenPriceModel }>({
      url: "/tokens/" + encodeURIComponent(path) + "/prices",
    });

    return response.data.data;
  };

  public getTokenDetailByPath = async (
    path: string,
  ): Promise<ITokenDetailResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const tempPath = path.replace(/\//g, "%2F");
    const response = await this.networkClient.get<{
      data: ITokenDetailResponse;
    }>({
      url: `/tokens/${tempPath}/details`,
    });
    return response.data.data;
  };

  public getChain = async (): Promise<IChainResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const response = await this.networkClient.get<{ data: IChainResponse }>({
      url: "/chain",
    });
    return response.data.data;
  };

  public getBalancesByAddress = async (
    address: string,
  ): Promise<IBalancesByAddressResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const response = await this.networkClient.get<IBalancesByAddressResponse>({
      url: `/balances/${address}`,
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
