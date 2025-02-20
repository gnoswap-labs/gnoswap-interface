import { NetworkClient } from "@common/clients/network-client";
import { CommonError } from "@common/errors";
import { APIResponse } from "@repositories/common";
import { SyncInfoResponse } from "./response";
import { StatusRepository } from "./status-repository";

export class StatusRepositoryImpl implements StatusRepository {
  private networkClient: NetworkClient | null;

  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
  }

  async getSyncInfo(): Promise<SyncInfoResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { data } = await this.networkClient.get<APIResponse<SyncInfoResponse>>({
      url: "/util/sync-info",
    });

    if (!data) {
      throw new CommonError("NOT_FOUND_DATA");
    }

    return data.data;
  }
}
