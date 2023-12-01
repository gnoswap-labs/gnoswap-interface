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
}

export interface NativeTokenModel extends TokenModel {
  originName: string;

  originSymbol: string;

  originDenom: string;
}
