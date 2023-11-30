import { SwapRouterRepository } from "./swap-router-repository";
import { EstimateSwapRouteRequest } from "./request/estimate-swap-route-request";
import { SwapRouteRequest } from "./request/swap-route-request";
import { EstimateSwapRouteResponse } from "./response/estimate-swap-route-response";

export class SwapRouterRepositoryMock implements SwapRouterRepository {
  public estimateSwapRoute = async (
    request: EstimateSwapRouteRequest,
  ): Promise<EstimateSwapRouteResponse> => {
    console.log(request);
    return {
      amount: 213,
    };
  };

  public swapRoute = async (request: SwapRouteRequest): Promise<string> => {
    console.log(request);
    return "tx_hash";
  };
}
