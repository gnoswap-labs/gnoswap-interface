import { TokenModel } from "@models/token/token-model";

export interface EstimateSwapRouteRequest {
  inputToken: TokenModel;

  outputToken: TokenModel;

  tokenAmount: number;

  exactType: "EXACT_IN" | "EXACT_OUT";
}
