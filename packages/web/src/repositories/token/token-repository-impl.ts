import {
  TokenRepository,
  TokenSearchLogListResponse,
  TokenListResponse,
  TokenPriceListResponse,
} from ".";

import { StorageKeyType } from "@common/values";
import { TokenSearchLogModel } from "@models/token/token-search-log-model";
import { StorageClient } from "@common/clients/storage-client";
import { NetworkClient } from "@common/clients/network-client";

const dummy = {
  tokens: [
    {
      chainId: "dev.gnoswap",
      createdAt: "2023-11-28T10:26:36Z",
      name: "Bar",
      address: "g1w8wqgrp08cqhtupzx98n4jtm8kqy7vadfmmyd0",
      path: "gno.land/r/bar",
      decimals: 4,
      symbol: "BAR",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
      priceId: "gno.land/r/bar",
    },
    {
      chainId: "dev.gnoswap",
      createdAt: "2023-11-28T10:26:34Z",
      name: "Baz",
      address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
      path: "gno.land/r/baz",
      decimals: 4,
      symbol: "Baz",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
      priceId: "gno.land/r/baz",
    },
    {
      chainId: "dev.gnoswap",
      createdAt: "2023-11-28T10:26:38Z",
      name: "QUX",
      address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
      path: "gno.land/r/qux",
      decimals: 4,
      symbol: "QUX",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
      priceId: "gno.land/r/qux",
    },
  ],
};

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
      return dummy;
    }
    return response.data;
  };

  public getTokenPrices = async (): Promise<TokenPriceListResponse> => {
    const response = await this.networkClient.get<TokenPriceListResponse>({
      url: "/tokenPrices",
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
