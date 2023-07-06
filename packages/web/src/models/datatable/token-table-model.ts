import { BigNumber } from "bignumber.js";
import { TokenTableSelectType } from "@common/values/data-constant";
import { TokenPairModel } from "@models/token/token-pair-model";
export interface TokenTableModel {
  hits: number;
  total: number;
  tokens: Array<TokenDetailType>;
}

export interface TokenDetailType {
  tokenId: string;
  type: TokenTableSelectType;
  name: string;
  symbol: string;
  price: BigNumber;
  priceOf1h: BigNumber;
  priceOf24h: BigNumber;
  priceOf7d: BigNumber;
  mCap: BigNumber;
  tvl: BigNumber;
  volume: BigNumber;
  mostLiquidityPool: MostLiquidityPoolType;
  graph: Array<number>;
}

export interface MostLiquidityPoolType {
  feeTier: number;
  apr: number;
  tokenPair: TokenPairModel;
}
