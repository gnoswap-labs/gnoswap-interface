import { EstimatedRoute } from "@gnoswap-labs/swap-router";
import { TokenModel } from "@models/token/token-model";

export interface SwapRouteRequest {
  inputToken: TokenModel;

  outputToken: TokenModel;

  tokenAmount: number;

  exactType: "EXACT_IN" | "EXACT_OUT";

  estimatedRoutes: EstimatedRoute[];

  tokenAmountLimit: number;
}
