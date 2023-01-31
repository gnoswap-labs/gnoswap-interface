export interface SwapRequest {
	token0: {
		symbol: string;
		logo: string;
		amount: number;
	};
	token1: {
		symbol: string;
		logo: string;
		amount: number;
	};
	slippage: number;
	gasFee: number;
	priceImpact?: number;
	minReceived?: number;
}
