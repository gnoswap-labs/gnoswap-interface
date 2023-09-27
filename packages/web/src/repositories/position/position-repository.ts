import { PositionListResponse, PositionDetailResponse } from "./response";

export interface PositionRepository {
  getPositions: () => Promise<PositionListResponse>;

  getPositionDetailByPositionId: (
    positionId: string,
  ) => Promise<PositionDetailResponse>;
}
