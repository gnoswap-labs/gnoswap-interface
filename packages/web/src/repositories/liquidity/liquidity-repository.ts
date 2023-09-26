import { AddLiquidityRequest, RemoveLiquidityRequest } from "./request";
import {
  AddLiquidityResponse,
  ClaimRewardResponse,
  RemoveLiquidityResponse,
} from "./response";

export interface LiquidityRepository {
  addLiquidityBy: (
    request: AddLiquidityRequest,
  ) => Promise<AddLiquidityResponse>;

  removeLiquiditiesBy: (
    request: RemoveLiquidityRequest,
  ) => Promise<RemoveLiquidityResponse>;

  claimRewardByPoolId: (poolId: string) => Promise<ClaimRewardResponse>;
}
