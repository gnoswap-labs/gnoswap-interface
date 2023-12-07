import { TokenPairInfo } from "./token-pair-info";

export interface MostLiquidPool {
  poolId: string;
  tokenPair: TokenPairInfo;
  feeRate: string;
}
export interface TokenModel {
  path: string;

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

  type?: string

  description?: string

  websiteURL?: string

  originName?: string

  originSymbol?: string

  originDenom?: string
}

export interface NativeTokenModel extends TokenModel {
  originName: string;

  originSymbol: string;

  originDenom: string;
}
