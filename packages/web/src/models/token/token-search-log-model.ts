import { TokenModel } from "./token-model";

export interface TokenSearchLogModel {
  searchType: string;

  changeRate: string;

  token: TokenModel;
}
