import { TokenInfo } from "@models/token/token-info";

export interface SwapTokenModel {
  token: TokenInfo;
  amount: string;
  price: string;
  balance: string;
}
