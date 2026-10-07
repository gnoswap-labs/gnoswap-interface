import {
  IChainResponse,
  ITokenDetailResponse,
  ITokenResponse,
  TokenListResponse,
  TokenPriceListResponse,
  TokenRepository,
  TokenSearchLogListResponse,
} from ".";

import { StorageClient } from "@common/clients/storage-client";
import { StorageKeyType } from "@common/values";
import { TokenPriceModel } from "@models/token/token-price-model";
import { TokenSearchLogModel } from "@models/token/token-search-log-model";
import TokenByPath from "./mock/token-by-path.json";
import ChainData from "./mock/token-chain.json";
import TokenDetail from "./mock/token-detail.json";
import mockedExchangeRateGraph from "./mock/token-exchange-rate-graph.json";
import TokenPrice from "./mock/token-price.json";
import { IBalancesByAddressResponse, IGrc20TransferHistoryResponse } from "./response/balance-by-address-response";
import { TokenExchangeRateGraphResponse } from "./response/token-exchange-rate-response";

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

  public getTokens = async (showUnverified: boolean): Promise<TokenListResponse> => {
    void showUnverified;
    return { tokens: [] };
  };

  public getTokenByPath = async (path: string): Promise<ITokenResponse> => {
    return { ...TokenByPath, path: path } as ITokenResponse;
  };

  public getTokenPrices = async (): Promise<TokenPriceListResponse> => {
    return { data: [] };
  };

  public getTokenDetailByPath = async (path: string): Promise<ITokenDetailResponse> => {
    console.log(path);

    return TokenDetail;
  };

  public getChain = async (): Promise<IChainResponse> => {
    return ChainData;
  };

  public createSearchLog = async (searchLog: TokenSearchLogModel): Promise<boolean> => {
    const LOG_LIMIT = 10;
    const searchLogs = await this.getSearchLogs();
    const addedSearchLogs = [searchLog, ...searchLogs].slice(0, LOG_LIMIT);
    this.localStorageClient.set("search-token-logs", JSON.stringify(addedSearchLogs));
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
    } catch {
      throw new Error("Invalid value");
    }
    return logs;
  };

  public clearSearchLogs = async (): Promise<boolean> => {
    this.localStorageClient.remove("search-token-logs");
    return true;
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  public getGrc20BalancesByAddress = async (address: string): Promise<IBalancesByAddressResponse> => {
    return {
      data: [],
      message: "",
    };
  };

  public getGrc20TransferHistoryByTxHash = async (
    txHash: string,
    tokenPath: string,
  ): Promise<IGrc20TransferHistoryResponse> => {
    return {
      data: [],
      message: "",
    };
  };
}
