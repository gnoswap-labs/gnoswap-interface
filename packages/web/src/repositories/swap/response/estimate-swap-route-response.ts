import { EstimatedRoute } from "@gnoswap-labs/swap-router";

export interface EstimateSwapRouteResponse {
  estimatedRoutes: EstimatedRoute[];
  amount: string;
}
