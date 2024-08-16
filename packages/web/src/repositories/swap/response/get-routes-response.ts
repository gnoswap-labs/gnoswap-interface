import { EstimatedRoute } from "@models/swap/swap-route-info";

export interface GetRoutesResponse {
  estimatedRoutes: EstimatedRoute[];
  amount: string;
}
