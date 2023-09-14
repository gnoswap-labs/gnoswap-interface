import { TokenDefaultModel } from "@models/token/token-default-model";

export interface SwapTokenModel {
  token: TokenDefaultModel;
  amount: string;
  price: string;
  balance: string;
}
