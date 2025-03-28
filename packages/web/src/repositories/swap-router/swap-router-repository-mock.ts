import { SwapRouterRepository } from "./swap-router-repository";
import { GetRoutesRequest } from "./request/get-routes-request";
import { GetRoutesResponse } from "./response/get-routes-response";

export class SwapRouterRepositoryMock implements SwapRouterRepository {
  public callGetSwapFee = async () => {
    return 0;
  };

  public getRoutes = async (request: GetRoutesRequest): Promise<GetRoutesResponse> => {
    console.log(request);
    return {
      estimatedRoutes: [],
      amount: "0",
      status: "NO_LIQUIDITY",
    };
  };

  public sendSwapRoute = async () => {
    throw new Error("Mock sendSwapRoute");
  };

  public getDrySwap = async () => {
    throw new Error("Mcok drySwapRoute");
  };

  public sendExactInSwapRoute = async () => {
    throw new Error("Mock sendExactInSwapRoute");
  };

  public sendExactOutSwapRoute = async () => {
    throw new Error("Mock sendExactOutSwapRoute");
  };

  public sendWrapToken = async () => {
    throw new Error("Mock sendWrapToken");
  };

  public sendUnwrapToken = async () => {
    throw new Error("Mock sendUnwrapToken");
  };
}
