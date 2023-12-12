import { PositionModel } from "@models/position/position-model";
import { ClaimAllRequest } from "./request/claim-all-request";
import { DecreaseLiquidityReqeust } from "./request/decrease-liquidity-request";

export interface PositionRepository {
  getPositionsByAddress: (address: string) => Promise<PositionModel[]>;

  claimAll: (request: ClaimAllRequest) => Promise<string | null>;

  decreaseLiquidity: (
    request: DecreaseLiquidityReqeust,
  ) => Promise<string | null>;
}
