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
import TokenDetail from "./mock/token-detail.json";
import ChainData from "./mock/token-chain.json";
import TokenByPath from "./mock/token-by-path.json";
import TokenPrice from "./mock/token-price.json";
import { IBalancesByAddressResponse } from "./response/balance-by-address-response";
import { TokenExchangeRateGraphResponse } from "./response/token-exchange-rate-response";
import mockedExchangeRateGraph from "./mock/token-exchange-rate-graph.json";
import { TokenPriceModel } from "@models/token/token-price-model";

export class TokenRepositoryMock implements TokenRepository {
  private localStorageClient: StorageClient<StorageKeyType>;

  constructor(localStorageClient: StorageClient) {
    this.localStorageClient = localStorageClient;
  }
  public getTokenPricesByPath = async (path: string): Promise<TokenPriceModel> => {
    return { ...TokenPrice, path: path } as TokenPriceModel;
  };

  public getExchangeRateGraph = async (): Promise<TokenExchangeRateGraphResponse> => {
    return mockedExchangeRateGraph;
  };

  public getTokens = async (): Promise<TokenListResponse> => {
    return { tokens: [] };
  };

  public getTokenByPath = async (path: string): Promise<ITokenResponse> => {
    return { ...TokenByPath, path: path } as ITokenResponse;
  };

  public getTokenPrices = async (): Promise<TokenPriceListResponse> => {
    return { data: [] };
  };

  public getTokenDetailByPath = async (
    path: string,
  ): Promise<ITokenDetailResponse> => {
    console.log(path);

    return TokenDetail;
  };

  public getChain = async (): Promise<IChainResponse> => {
    return ChainData;
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

  public getBalancesByAddress = async (
    address: string,
  ): Promise<IBalancesByAddressResponse> => {
    return {
      address: address,
      balances: [],
    };
  };
}
