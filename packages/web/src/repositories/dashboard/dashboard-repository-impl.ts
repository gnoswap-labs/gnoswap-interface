import { StorageKeyType } from "@common/values";
import { StorageClient } from "@common/clients/storage-client";
import { NetworkClient } from "@common/clients/network-client";
import { DashboardRepository } from "./dashboard-repository";
import { TvlResponse } from "./response";
import { VolumeResponse } from "./response/volume-response";
import { DashboardTokenResponse } from "./response/token-response";

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
    const { data } = await this.networkClient.get<TvlResponse>({
      url: "/dashboard_tvl",
    });
    return data;
  };
  public getDashboardVolume = async (): Promise<VolumeResponse> => {
    const { data } = await this.networkClient.get<VolumeResponse>({
      url: "/dashboard_volume",
    });
    return data;
  };
  public getDashboardToken = async (): Promise<DashboardTokenResponse> => {
    const { data } = await this.networkClient.get<DashboardTokenResponse>({
      url: "/dashboard_gns_gnot",
    });
    return data;
  };
}
