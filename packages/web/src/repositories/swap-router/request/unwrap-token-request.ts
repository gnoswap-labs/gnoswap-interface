import { TokenModel } from "@models/token/token-model";

export interface UnwrapTokenRequest {
  token: TokenModel;

  tokenAmount: string;

  gasFee?: string;

  gasUsed?: string;
}
