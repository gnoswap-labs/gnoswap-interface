import { TokenModel } from "@models/token/token-model";

export interface TokenListResponse {
  tokens: TokenModel[];
}

export interface ITokenResponse {
  type: string;
  chainId: string;
  createdAt: string;
  name: string;
  path: string;
  decimals: number;
  symbol: string;
  logoURI: string;
  priceId: string;
  description: string;
  websiteURL: string;
  displayPath: string;
  wrappedPath: string;
}