import {
  IChainResponse,
  ITokenDetailResponse,
  ITokenResponse,
  TokenListResponse,
  TokenPriceListResponse,
  TokenRepository,
  TokenSearchLogListResponse,
} from ".";

import { NetworkClient } from "@common/clients/network-client";
import { StorageClient } from "@common/clients/storage-client";
import { CommonError } from "@common/errors";
import { StorageKeyType } from "@common/values";
import { customSort } from "@containers/select-token-container/SelectTokenContainer";
import { TokenPriceModel } from "@models/token/token-price-model";
import { TokenSearchLogModel } from "@models/token/token-search-log-model";
import { formatDisplayTokenSymbol } from "@utils/token-utils";
import mockedExchangeRateGraph from "./mock/token-exchange-rate-graph.json";
import { IBalancesByAddressResponse, IGrc20TransferHistoryResponse } from "./response/balance-by-address-response";
import { TokenExchangeRateGraphResponse } from "./response/token-exchange-rate-response";

export class TokenRepositoryImpl implements TokenRepository {
  private networkClient: NetworkClient | null;
  private localStorageClient: StorageClient<StorageKeyType>;

  constructor(networkClient: NetworkClient | null, localStorageClient: StorageClient<StorageKeyType>) {
    this.networkClient = networkClient;
    this.localStorageClient = localStorageClient;
  }

  public getExchangeRateGraph = async (): Promise<TokenExchangeRateGraphResponse> => {
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
    return {
      ...response.data.data,
      displaySymbol: formatDisplayTokenSymbol(response.data.data.symbol),
    };
  };

  public getTokens = async (showUnverified: boolean): Promise<TokenListResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const response = await this.networkClient.get<{ data: ITokenResponse[] }>({
      url: `/token-metas?showUnverified=${showUnverified}`,
    });
    if (response.data.data === null) {
      return { tokens: [] };
    }
    const tokens =
      response?.data?.data
        .map(token => ({
          ...token,
          displaySymbol: formatDisplayTokenSymbol(token.symbol),
        }))
        .sort(customSort) || [];
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

  public getTokenDetailByPath = async (path: string): Promise<ITokenDetailResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const tempPath = path.replace(/\//g, "%2F");
    const response = await this.networkClient.get<{
      data: ITokenDetailResponse;
    }>({
      url: `/tokens/${tempPath}/details`,
    });
    return {
      ...response.data.data,
      bestPools: response.data.data.bestPools.map(pool => ({
        ...pool,
        tokenA: {
          ...pool.tokenA,
          displaySymbol: formatDisplayTokenSymbol(pool.tokenA.symbol),
        },
        tokenB: {
          ...pool.tokenB,
          displaySymbol: formatDisplayTokenSymbol(pool.tokenB.symbol),
        },
      })),
    };
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

  public getGrc20BalancesByAddress = async (address: string): Promise<IBalancesByAddressResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const response = await this.networkClient.get<IBalancesByAddressResponse>({
      url: `/users/${address}/balances`,
    });
    return response.data;
  };

  public getGrc20TransferHistoryByTxHash = async (
    txHash: string,
    tokenPath: string,
  ): Promise<IGrc20TransferHistoryResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const response = await this.networkClient.get<IGrc20TransferHistoryResponse>({
      url: `/activity/transfers?txHash=${encodeURIComponent(txHash)}&tokenPath=${encodeURIComponent(tokenPath)}`,
    });
    return response.data;
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
}
