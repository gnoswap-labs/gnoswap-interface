import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import { EstimateSwapRouteRequest } from "./request/estimate-swap-route-request";
import { SwapRouteRequest } from "./request/swap-route-request";
import { EstimateSwapRouteResponse } from "./response/estimate-swap-route-response";

export interface SwapRouterRepository {
  updatePools: (pools: PoolRPCModel[]) => void;

  estimateSwapRoute: (
    request: EstimateSwapRouteRequest,
  ) => Promise<EstimateSwapRouteResponse>;

  swapRoute: (request: SwapRouteRequest) => Promise<string>;
}
