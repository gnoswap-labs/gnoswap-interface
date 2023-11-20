import { EstimateRouteQuotesRequest } from "./request";
import { EstimateRouteQuotesResponse } from "./response/estimate-route-quotes-response";

export interface SwapRouterRepository {
  estimateRouteQuotes: (
    request: EstimateRouteQuotesRequest,
  ) => Promise<EstimateRouteQuotesResponse>;
}
