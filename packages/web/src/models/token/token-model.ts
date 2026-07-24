import { TokenPairInfo } from "./token-pair-info";

export interface MostLiquidPool {
  poolId: string;
  tokenPair: TokenPairInfo;
  feeRate: string;
}
export interface TokenModel {
  path: string;

  type: "Native" | "GRC20";

  address?: string;

  chainId: string;

  name: string;

  symbol: string;

  displaySymbol: string;

  decimals: number;

  logoURI: string;

  createdAt: string;

  isWrappedGasToken?: boolean;

  isGasToken?: boolean;

  description?: string;

  websiteURL?: string;

  twitterURL?: string;

  discordURL?: string;

  docsURL?: string;

  wrappedPath?: string;

  denom?: string;

  priceID: string;
}

export interface NativeTokenModel extends TokenModel {
  wrappedPath: string;
}

export function isNativeToken(token: TokenModel): token is NativeTokenModel {
  return token.type?.toLowerCase() === "native";
}

export function isNativeTokenByType(type: "Native" | string) {
  return type.toLowerCase() === "native";
}
