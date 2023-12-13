import { PositionModel } from "@models/position/position-model";
import { ClaimAllRequest } from "./request/claim-all-request";
import { DecreaseLiquidityReqeust } from "./request/decrease-liquidity-request";
import { StakePositionsRequest } from "./request/stake-positions-request";
import { UnstakePositionsRequest } from "./request/unstake-positions-request";

export interface PositionRepository {
  getPositionsByAddress: (address: string) => Promise<PositionModel[]>;

  claimAll: (request: ClaimAllRequest) => Promise<string | null>;

  stakePositions: (request: StakePositionsRequest) => Promise<string | null>;

  unstakePositions: (
    request: UnstakePositionsRequest,
  ) => Promise<string | null>;

  decreaseLiquidity: (
    request: DecreaseLiquidityReqeust,
  ) => Promise<string | null>;
}
