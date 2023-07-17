import BigNumber from "bignumber.js";
import { TokenDefaultModel } from "./token-default-model";

export interface TokenSearchListModel {
  items: Array<TokenSearchItemType>;
}

export interface TokenSearchItemType {
  searchType: string;
  changeRate: BigNumber;
  token: TokenDefaultModel;
}
