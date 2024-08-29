import { NetworkClient } from "@common/clients/network-client";
import { SyncInfoResponse } from "./response";
import { StatusRepository } from "./status-repository";
import { APIResponse } from "@repositories/common";
import { CommonError } from "@common/errors";

export class StatusRepositoryImpl implements StatusRepository {
  private networkClient: NetworkClient | null;

  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
  }

  async getSyncInfo(): Promise<SyncInfoResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { data } = await this.networkClient.get<
      APIResponse<SyncInfoResponse>
    >({
      url: "/util/sync-info",
    });

    if (!data || data.error.code !== undefined) {
      throw new CommonError("NOT_FOUND_DATA");
    }

    return data.data;
  }
}
