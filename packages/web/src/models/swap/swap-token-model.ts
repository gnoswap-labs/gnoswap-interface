import { TokenModel } from "@models/token/token-model";

export interface SwapTokenModel {
  token: TokenModel;
  amount: string;
  price: string;
  balance: string;
}
