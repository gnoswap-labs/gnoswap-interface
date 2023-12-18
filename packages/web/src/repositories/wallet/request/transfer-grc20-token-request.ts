import { TokenModel } from "@models/token/token-model";

export interface TransferGRC20TokenRequest {
  token: TokenModel;

  // only integer
  tokenAmount: number;

  fromAddress: string;

  toAddress: string;
}
