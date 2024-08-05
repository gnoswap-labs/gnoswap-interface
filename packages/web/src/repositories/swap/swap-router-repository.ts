import { WalletResponse } from "@common/clients/wallet-client/protocols";

import { EstimateSwapRouteRequest } from "./request/estimate-swap-route-request";
import { SwapRouteRequest } from "./request/swap-route-request";
import { UnwrapTokenRequest } from "./request/unwrap-token-request";
import { WrapTokenRequest } from "./request/wrap-token-request";
import { EstimateSwapRouteResponse } from "./response/estimate-swap-route-response";
import {
  SwapRouteFailedResponse,
  SwapRouteSuccessResponse,
} from "./response/swap-route-response";

export interface SwapRouterRepository {
  estimateSwapRoute: (
    request: EstimateSwapRouteRequest,
  ) => Promise<EstimateSwapRouteResponse>;

  swapRoute: (
    request: SwapRouteRequest,
  ) => Promise<
    WalletResponse<SwapRouteSuccessResponse | SwapRouteFailedResponse>
  >;

  wrapToken: (
    request: WrapTokenRequest,
  ) => Promise<WalletResponse<{ hash: string }>>;

  unwrapToken: (
    request: UnwrapTokenRequest,
  ) => Promise<WalletResponse<{ hash: string }>>;

  getSwapFee: () => Promise<number>;
}
