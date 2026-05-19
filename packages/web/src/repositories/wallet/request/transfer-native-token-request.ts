import { TokenModel } from "@models/token/token-model";

export interface TransferNativeTokenRequest {
  token: TokenModel;

  // only integer
  tokenAmount: string;

  fromAddress: string;

  toAddress: string;

  gasFee?: string;

  gasUsed?: string;
}
