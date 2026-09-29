import { TransactionMessage, WalletResponse } from "@common/clients/wallet-client/protocols";

import { GetRoutesRequest } from "./request/get-routes-request";
import { DrySwapRequest, SwapRouteMessagesRequest, SwapRouteRequest } from "./request/swap-route-request";
import { UnwrapTokenRequest } from "./request/unwrap-token-request";
import { WrapTokenMessagesRequest, WrapTokenRequest } from "./request/wrap-token-request";
import { GetRoutesResponse } from "./response/get-routes-response";
import { SwapRouteFailedResponse, SwapRouteSuccessResponse } from "./response/swap-route-response";

export interface SwapRouterRepository {
  getRoutes: (request: GetRoutesRequest) => Promise<GetRoutesResponse>;

  getDrySwap: (request: DrySwapRequest) => Promise<number>;

  /**
   * The messages `sendExactInSwapRoute` would broadcast, approvals and the
   * wrapping deposit included. Exposed so a caller can weigh the transaction
   * before sending it.
   */
  makeExactInSwapRouteMessages: (request: SwapRouteMessagesRequest) => Promise<TransactionMessage[]>;

  makeExactOutSwapRouteMessages: (request: SwapRouteMessagesRequest) => Promise<TransactionMessage[]>;

  sendExactInSwapRoute: (
    request: SwapRouteRequest,
  ) => Promise<WalletResponse<SwapRouteSuccessResponse | SwapRouteFailedResponse>>;

  sendExactOutSwapRoute: (
    request: SwapRouteRequest,
  ) => Promise<WalletResponse<SwapRouteSuccessResponse | SwapRouteFailedResponse>>;

  /** The messages `sendWrapToken` would broadcast. */
  makeWrapTokenMessages: (request: WrapTokenMessagesRequest) => Promise<TransactionMessage[]>;

  sendWrapToken: (request: WrapTokenRequest) => Promise<WalletResponse<{ hash: string }>>;

  sendUnwrapToken: (request: UnwrapTokenRequest) => Promise<WalletResponse<{ hash: string }>>;

  callGetSwapFee: () => Promise<number>;
}
