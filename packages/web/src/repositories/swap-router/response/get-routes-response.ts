import { EstimatedRoute } from "@models/swap/swap-route-info";

export type GetRoutesResponse =
  | {
      status: "SUCCESS";
      estimatedRoutes: EstimatedRoute[];
      originAmount: number;
      amount: string;
    }
  | { status: "NO_LIQUIDITY" | "INVALID_PARAMS" };
