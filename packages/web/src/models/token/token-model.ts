import { TokenPairInfo } from "./token-pair-info";

export interface MostLiquidPool {
  poolId: string;
  tokenPair: TokenPairInfo;
  feeRate: string;
}
export interface TokenModel {
  path: string;

  type: "native" | "grc20";

  address: string;

  priceId: string;

  chainId: string;

  name: string;

  symbol: string;

  decimals: number;

  logoURI: string;

  createdAt: string;

  isWrappedGasToken?: boolean;

  isGasToken?: boolean;

  description?: string

  websiteURL?: string

  originName?: string

  originSymbol?: string

  originDenom?: string
  denom?: string;
}

export interface NativeTokenModel extends TokenModel {
  originName: string;

  originSymbol: string;

  originDenom: string;
}
