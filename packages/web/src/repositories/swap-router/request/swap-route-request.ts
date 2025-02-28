import { EstimatedRoute } from "@models/swap/swap-route-info";
import { TokenModel } from "@models/token/token-model";

export interface DrySwapRequest {
  inputToken: TokenModel;

  outputToken: TokenModel;

  tokenAmount: number;

  exactType: "EXACT_IN" | "EXACT_OUT";

  estimatedRoutes: EstimatedRoute[];

  tokenAmountLimit: number;
}

export interface SwapRouteRequest {
  inputToken: TokenModel;

  outputToken: TokenModel;

  tokenAmount: number;

  estimatedRoutes: EstimatedRoute[];

  tokenAmountLimit: number;

  deadline: number;

  referrerAddress: string | null;
}
