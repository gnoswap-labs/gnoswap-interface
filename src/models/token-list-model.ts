export interface TokenListModel {
	name: string;
	symbol: string;
	currentPrice: number;
	price1d: number;
	price7d: number;
	price30d: number;
	mCap: number;
	tvl: number;
	volumn: number;
	mostLiquidPool: any; // 토큰페어의 정보가 들어있는 객체
	graph: Array<number>;
}
