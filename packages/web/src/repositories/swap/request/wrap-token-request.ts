import { TokenModel } from "@models/token/token-model";

export interface WrapTokenRequest {
  token: TokenModel;

  tokenAmount: string;
}
