import { SwapRouterRepository } from "./swap-router-repository";
import { EstimateSwapRouteRequest } from "./request/estimate-swap-route-request";
import { SwapRouteRequest } from "./request/swap-route-request";
import { EstimateSwapRouteResponse } from "./response/estimate-swap-route-response";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";

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

  public swapRoute = async (request: SwapRouteRequest): Promise<string> => {
    console.log(request);
    return "tx_hash";
  };
}
