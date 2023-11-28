import { EstimatedRouteModel } from "@models/swap/estimated-route-model";
import { TokenModel } from "@models/token/token-model";

export interface SwapRouteRequest {
  inputToken: TokenModel;

  outputToken: TokenModel;

  tokenAmount: number;

  exactType: "EXACT_IN" | "EXACT_OUT";

  estimatedRoutes: EstimatedRouteModel[];

  tokenAmountLimit: number;
}
