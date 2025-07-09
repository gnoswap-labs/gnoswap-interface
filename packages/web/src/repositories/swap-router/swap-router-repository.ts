import { WalletResponse } from "@common/clients/wallet-client/protocols";

import { GetRoutesRequest } from "./request/get-routes-request";
import { DrySwapRequest, SwapRouteOptions, SwapRouteRequest } from "./request/swap-route-request";
import { UnwrapTokenRequest } from "./request/unwrap-token-request";
import { WrapTokenRequest } from "./request/wrap-token-request";
import { GetRoutesResponse } from "./response/get-routes-response";
import { SwapRouteFailedResponse, SwapRouteSuccessResponse } from "./response/swap-route-response";

export interface SwapRouterRepository {
  getRoutes: (request: GetRoutesRequest) => Promise<GetRoutesResponse>;

  getDrySwap: (request: DrySwapRequest) => Promise<number>;

  sendExactInSwapRoute: (
    request: SwapRouteRequest,
    options?: SwapRouteOptions,
  ) => Promise<WalletResponse<SwapRouteSuccessResponse | SwapRouteFailedResponse>>;

  sendExactOutSwapRoute: (
    request: SwapRouteRequest,
    options?: SwapRouteOptions,
  ) => Promise<WalletResponse<SwapRouteSuccessResponse | SwapRouteFailedResponse>>;

  sendWrapToken: (request: WrapTokenRequest) => Promise<WalletResponse<{ hash: string }>>;

  sendUnwrapToken: (request: UnwrapTokenRequest) => Promise<WalletResponse<{ hash: string }>>;

  callGetSwapFee: () => Promise<number>;
}
