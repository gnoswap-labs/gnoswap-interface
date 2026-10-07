import { Grc20Routes, TokenModel } from "@models/token/token-model";

export interface TokenListResponse {
  tokens: TokenModel[];
}

export interface ITokenResponse {
  type: "Native" | "GRC20";
  chainId: string;
  createdAt: string;
  name: string;
  path: string;
  decimals: number;
  symbol: string;
  displaySymbol: string;
  logoURI: string;
  priceID: string;
  priceId: string;
  description: string;
  websiteURL: string;
  twitterURL: string;
  discordURL: string;
  docsURL: string;
  displayPath: string;
  wrappedPath: string;
  isVerified: boolean;
  pkgPath?: string;
  routes?: Grc20Routes;
}
