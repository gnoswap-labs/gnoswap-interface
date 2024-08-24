import { NetworkClient } from "@common/clients/network-client";
import { StorageClient } from "@common/clients/storage-client";
import { CommonError } from "@common/errors";
import { StorageKeyType } from "@common/values";
import { ActivityResponse } from "@repositories/activity/responses/activity-responses";

import { DashboardRepository } from "./dashboard-repository";
import {
  OnchainAccountRequest,
  OnchainRequest,
} from "./request";
import { TvlResponse } from "./response";
import { DashboardTokenResponse } from "./response/token-response";
import { IVolumeResponse } from "./response/volume-response";

export class DashboardRepositoryImpl implements DashboardRepository {
  private networkClient: NetworkClient | null;
  private localStorageClient: StorageClient<StorageKeyType>;

  constructor(
    networkClient: NetworkClient | null,
    localStorageClient: StorageClient<StorageKeyType>,
  ) {
    this.networkClient = networkClient;
    this.localStorageClient = localStorageClient;
  }

  public getDashboardTvl = async (): Promise<TvlResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { data } = await this.networkClient.get<{ data: TvlResponse }>({
      url: "/dashboard/tvl",
    });

    return data.data;
  };

  public getDashboardVolume = async (): Promise<IVolumeResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { data } = await this.networkClient.get<{ data: IVolumeResponse }>({
      url: "/dashboard/volume",
    });
    return data.data;
  };

  public getDashboardToken = async (): Promise<DashboardTokenResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { data } = await this.networkClient.get<{
      data: DashboardTokenResponse;
    }>({
      url: "/dashboard/gns_gnot",
    });
    return data.data;
  };

  public getDashboardOnchainActivity = async (
    request: OnchainRequest,
  ): Promise<ActivityResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    const { type } = request;

    const response = await this.networkClient
      .get<{ data: ActivityResponse }>({
        url: `/activity?type=${type}`,
      })
      .catch(() => null);
    if (!response?.data?.data) {
      return [];
    }
    return response.data.data;
  };

  public getAccountOnchainActivity = async (
    request: OnchainAccountRequest,
  ): Promise<ActivityResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }
    if (!request.address) {
      console.log("");
    }

    const { data } = await this.networkClient.get<ActivityResponse>({
      url: "/users/" + request.address + "/activity",
    });
    return data;
  };
}
