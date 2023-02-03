import { TokenPairModel } from "./../token/token-pair-model";
export interface TokenTableModel {
	hits: number;
	total: number;
	tokens: Array<TokenDetailType>;
}

interface TokenDetailType {
	tokenId: string;
	name: string;
	symbol: string;
	type: string;
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

interface MostLiquidityPoolType {
	feeTier: number;
	apr: number;
	tokenPair: TokenPairModel;
}
