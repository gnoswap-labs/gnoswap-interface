import { TokenDefaultModel } from "./token-default-model";

export interface TokenListModel {
  hits: number;
  total: number;
  tokens: Array<TokenDefaultModel>;
}
