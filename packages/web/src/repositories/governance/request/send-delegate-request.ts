import { TokenModel } from "@models/token/token-model";

export interface SendDelegateReqeust {
  gnsToken: TokenModel;
  to: string;
  amount: string;
  referrerAddress: string | null;
}
