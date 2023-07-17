import BigNumber from "bignumber.js";

export interface TokenMetaModel {
  tokens: Array<TokenMetaType>;
}

export interface TokenMetaType {
  tokenId: string;
  name: string;
  symbol: string;
  denom: string;
  minimalDenom: string;
  decimals: BigNumber;
}
