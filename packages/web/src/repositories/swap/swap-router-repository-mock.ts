import { SwapRouterRepository } from "./swap-router-repository";
import { EstimateSwapRouteRequest } from "./request/estimate-swap-route-request";
import { EstimateSwapRouteResponse } from "./response/estimate-swap-route-response";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import { UnwrapTokenRequest } from "./request/unwrap-token-request";
import { WrapTokenRequest } from "./request/wrap-token-request";

export class SwapRouterRepositoryMock implements SwapRouterRepository {
  public pools: PoolRPCModel[] = [];

  public updatePools(pools: PoolRPCModel[]) {
    this.pools = pools;
  }

  public estimateSwapRoute = async (
    request: EstimateSwapRouteRequest,
  ): Promise<EstimateSwapRouteResponse> => {
    console.log(request);
    return {
      estimatedRoutes: [],
      amount: "0",
    };
  };

  public swapRoute = async () => {
    throw new Error("Mock swapRoute");
  };

  public wrapToken = async () => {
    throw new Error("Mock wrapToken");
  };

  public unwrapToken = async () => {
    throw new Error("Mock unwrapToken");
  };
}
