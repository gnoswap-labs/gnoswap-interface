import { TokenModel } from "@models/token/token-model";

export interface SwapRouteResponse {
  hash: string;

  height: string;

  resultToken: TokenModel;

  resultAmount: string;

  slippageAmount: string;
}
