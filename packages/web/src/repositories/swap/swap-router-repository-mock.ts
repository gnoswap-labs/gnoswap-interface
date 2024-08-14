import { SwapRouterRepository } from "./swap-router-repository";
import { GetRoutesRequest } from "./request/get-routes-request";
import { GetRoutesResponse } from "./response/get-routes-response";

export class SwapRouterRepositoryMock implements SwapRouterRepository {
  public callGetSwapFee = async () => {
    return 0;
  };

  public getRoutes = async (
    request: GetRoutesRequest,
  ): Promise<GetRoutesResponse> => {
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
