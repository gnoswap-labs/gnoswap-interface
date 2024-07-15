import { TokenModel } from "@models/token/token-model";

export interface SwapRouteSuccessResponse {
  hash: string;
  height: string;
  resultToken: TokenModel;
  resultAmount: string;
  slippageAmount: string;
}

export interface SwapRouteFailedResponse {
  hash: string;
}
