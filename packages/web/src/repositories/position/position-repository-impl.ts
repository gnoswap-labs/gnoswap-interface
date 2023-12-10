import { NetworkClient } from "@common/clients/network-client";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PositionModel } from "@models/position/position-model";
import { PositionRepository } from "./position-repository";
import { PositionListResponse } from "./response";

export class PositionRepositoryImpl implements PositionRepository {
  private networkClient: NetworkClient;

  constructor(networkClient: NetworkClient) {
    this.networkClient = networkClient;
  }

  getPositionsByAddress = async (address: string): Promise<PositionModel[]> => {
    const response = await this.networkClient.get<PositionListResponse>({
      url: "/positions/" + address,
    });
    return PositionMapper.fromList(response.data);
  };
}
