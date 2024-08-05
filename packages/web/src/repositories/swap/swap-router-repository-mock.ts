import { SwapRouterRepository } from "./swap-router-repository";
import { EstimateSwapRouteRequest } from "./request/estimate-swap-route-request";
import { EstimateSwapRouteResponse } from "./response/estimate-swap-route-response";

export class SwapRouterRepositoryMock implements SwapRouterRepository {
  public getSwapFee = async () => {
    return 0;
  };

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
