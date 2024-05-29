import { StorageKeyType } from "@common/values";
import { StorageClient } from "@common/clients/storage-client";
import { NetworkClient } from "@common/clients/network-client";
import { DashboardRepository } from "./dashboard-repository";
import { TvlResponse } from "./response";
import { DashboardTokenResponse } from "./response/token-response";
import {
  OnChainRequestMapping,
  OnchainAccountRequest,
  OnchainRequest,
} from "./request";
import { OnchainActivityResponse } from "./response/onchain-response";
import { IVolumeResponse } from "./response/volume-response";

export class DashboardRepositoryImpl implements DashboardRepository {
  private networkClient: NetworkClient;
  private localStorageClient: StorageClient<StorageKeyType>;

  constructor(
    networkClient: NetworkClient,
    localStorageClient: StorageClient<StorageKeyType>,
  ) {
    this.networkClient = networkClient;
    this.localStorageClient = localStorageClient;
  }

  public getDashboardTvl = async (): Promise<TvlResponse> => {
    const { data } = await this.networkClient.get<{ data: TvlResponse }>({
      url: "/dashboard/tvl",
    });

    return data.data;
  };
  public getDashboardVolume = async (): Promise<IVolumeResponse> => {
    const { data } = await this.networkClient.get<{ data: IVolumeResponse }>({
      url: "/dashboard/volume",
    });
    return data.data;
  };
  public getDashboardToken = async (): Promise<DashboardTokenResponse> => {
    const { data } = await this.networkClient.get<{
      data: DashboardTokenResponse;
    }>({
      url: "/dashboard/gns_gnot",
    });
    return data.data;
  };

  public getDashboardOnchainActivity = async (
    request: OnchainRequest,
  ): Promise<OnchainActivityResponse> => {
    // type: "ALL" | "ADD" | "INCREASE" | "DECREASE" | "SWAP" | "STAKE" | "UNSTAKE" | "CLAIM" | "WITHDRAW" | "REMOVE";
    const response = await this.networkClient
      .get<{ data: OnchainActivityResponse }>({
        url: `/activity?type=${OnChainRequestMapping[request.type]}`,
      })
      .catch(() => null);
    if (!response?.data?.data) {
      return [];
    }
    return response.data.data;
  };

  public getAccountOnchainActivity = async (
    request: OnchainAccountRequest,
  ): Promise<OnchainActivityResponse> => {
    if (!request.address) {
      console.log("");
    }

    const { data } = await this.networkClient.get<OnchainActivityResponse>({
      url: "/users/" + request.address + "/activity",
    });
    return data;
  };
}
