import { NetworkClient } from "@common/clients/network-client";
import { PositionRepository } from "./position-repository";
import { PositionListResponse, PositionDetailResponse } from "./response";

export class PositionRepositoryImpl implements PositionRepository {
  private networkClient: NetworkClient;

  constructor(networkClient: NetworkClient) {
    this.networkClient = networkClient;
  }

  getPositions = async (): Promise<PositionListResponse> => {
    const response = await this.networkClient.get<PositionListResponse>({
      url: "/positions",
    });
    return response.data;
  };

  getPositionDetailByPositionId = async (
    positionId: string,
  ): Promise<PositionDetailResponse> => {
    const response = await this.networkClient.get<PositionDetailResponse>({
      url: "/positions/" + positionId,
    });
    return response.data;
  };
}
