import { TokenModel } from "@models/token/token-model";

export interface SendRedelegateReqeust {
  gnsToken: TokenModel;
  from: string;
  to: string;
  amount: string;
}
