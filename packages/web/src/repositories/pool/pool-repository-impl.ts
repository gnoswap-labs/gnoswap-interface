import { NetworkClient } from "@common/clients/network-client";
import { PoolDetailResponse, PoolListResponse, PoolRepository } from ".";

export class PoolRepositoryImpl implements PoolRepository {
  private networkClient: NetworkClient;

  constructor(networkClient: NetworkClient) {
    this.networkClient = networkClient;
  }

  getPools = async (): Promise<PoolListResponse> => {
    const response = await this.networkClient.get<PoolListResponse>({
      url: "/pools",
    });
    return response.data;
  };

  getPoolDetailByPoolId = async (
    poolId: string,
  ): Promise<PoolDetailResponse> => {
    const response = await this.networkClient.get<PoolDetailResponse>({
      url: "/pools/" + poolId,
    });
    return response.data;
  };
}
