import { EstimatedRoute } from "@models/swap/swap-route-info";

export interface GetRoutesResponse {
  estimatedRoutes: EstimatedRoute[];
  originAmount: number;
  amount: string;
  status: "SUCCESS" | "NO_LIQUIDITY" | "INVALID_PARAMS";
}
