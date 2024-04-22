import { StorageKeyType } from "@common/values";
import { StorageClient } from "@common/clients/storage-client";
import { NetworkClient } from "@common/clients/network-client";
import { DashboardRepository } from "./dashboard-repository";
import { TvlResponse } from "./response";
import { IVolumeResponse, VolumeResponse } from "./response/volume-response";
import { DashboardTokenResponse } from "./response/token-response";
import { OnchainAccountRequest, OnchainRequest } from "./request";
import { OnchainActivityResponse } from "./response/onchain-response";

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
    const { data } = await this.networkClient.get<{ data: TvlResponse}>({
      url: "/dashboard/tvl",
    });
    return data.data;
  };
  public getDashboardVolume = async (): Promise<VolumeResponse> => {
    const { data } = await this.networkClient.get<{ data: IVolumeResponse }>({
      url: "/dashboard/volume",
    });
    return data.data.volume;
  };
  public getDashboardToken = async (): Promise<DashboardTokenResponse> => {
    const { data } = await this.networkClient.get<DashboardTokenResponse>({
      url: "/dashboard/gns_gnot",
    });
    return data;
  };

  public getDashboardOnchainActivity = async (
    request: OnchainRequest,
  ): Promise<OnchainActivityResponse> => {

    const { data } = await this.networkClient.get<{ data: OnchainActivityResponse }>({
      url: `/activity?type=${request.type}`
    });
    return data.data || [];
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
