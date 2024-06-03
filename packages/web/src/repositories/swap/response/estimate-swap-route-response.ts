import { EstimatedRoute } from "@models/swap/swap-route-info";

export interface EstimateSwapRouteResponse {
  estimatedRoutes: EstimatedRoute[];
  amount: string;
}
