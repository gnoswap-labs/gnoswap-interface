import { TokenModel } from "@models/token/token-model";

export interface GetRoutesRequest {
  inputToken: TokenModel;
  outputToken: TokenModel;
  tokenAmount: number;
  exactType: "EXACT_IN" | "EXACT_OUT";
}
