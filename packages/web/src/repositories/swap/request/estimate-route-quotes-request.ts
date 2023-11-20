import { RouteModel } from "@models/swap/route-model";
import { TokenModel } from "@models/token/token-model";

export interface EstimateRouteQuotesRequest {
  inputToken: TokenModel;

  outputToken: TokenModel;

  amount: number;

  exactType: "EXACT_IN" | "EXACT_OUT";

  routes: RouteModel[];

  distributionRatio: number;
}
