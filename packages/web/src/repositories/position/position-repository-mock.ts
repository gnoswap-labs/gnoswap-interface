import { PositionRepository } from "./position-repository";
import { PositionListResponse, PositionDetailResponse } from "./response";

import PositionListData from "./mock/positions.json";
import PositionDetailData from "./mock/position-detail.json";

export class PositionRepositoryMock implements PositionRepository {
  getPositions = async (): Promise<PositionListResponse> => {
    return PositionListData as PositionListResponse;
  };

  getPositionDetailByPositionId = async (): Promise<PositionDetailResponse> => {
    return PositionDetailData as PositionDetailResponse;
  };
}
