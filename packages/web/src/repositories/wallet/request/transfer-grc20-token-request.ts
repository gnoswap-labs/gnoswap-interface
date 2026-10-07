import { TokenModel } from "@models/token/token-model";

export interface TransferGRC20TokenRequest {
  token: TokenModel;

  // only integer
  tokenAmount: string;

  fromAddress: string;

  toAddress: string;

  gasFee?: string;

  gasUsed?: string;
}
