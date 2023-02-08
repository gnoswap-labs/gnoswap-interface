import { TokenTableSelectType } from "@/common/values/data-constant";
import { TokenPairModel } from "./../token/token-pair-model";
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
	price: number;
	priceOf1h: number;
	priceOf24h: number;
	priceOf7d: number;
	mCap: number;
	tvl: number;
	volume: number;
	mostLiquidityPool: MostLiquidityPoolType;
	graph: Array<number>;
}

export interface MostLiquidityPoolType {
	feeTier: number;
	apr: number;
	tokenPair: TokenPairModel;
}
