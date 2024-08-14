import { SwapRouterRepository } from "./swap-router-repository";
import { EstimateSwapRouteRequest } from "./request/estimate-swap-route-request";
import { EstimateSwapRouteResponse } from "./response/estimate-swap-route-response";

export class SwapRouterRepositoryMock implements SwapRouterRepository {
  public callGetSwapFee = async () => {
    return 0;
  };

  public getRoutes = async (
    request: EstimateSwapRouteRequest,
  ): Promise<EstimateSwapRouteResponse> => {
    console.log(request);
    return {
      estimatedRoutes: [],
      amount: "0",
    };
  };

  public sendSwapRoute = async () => {
    throw new Error("Mock sendSwapRoute");
  };

  public sendWrapToken = async () => {
    throw new Error("Mock sendWrapToken");
  };

  public sendUnwrapToken = async () => {
    throw new Error("Mock sendUnwrapToken");
  };
}
