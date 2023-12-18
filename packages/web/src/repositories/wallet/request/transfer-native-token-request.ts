import { TokenModel } from "@models/token/token-model";

export interface TransferNativeTokenRequest {
  token: TokenModel;

  // only integer
  tokenAmount: number;

  fromAddress: string;

  toAddress: string;
}
