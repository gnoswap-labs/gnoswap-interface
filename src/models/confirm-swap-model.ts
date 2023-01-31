export interface ConfirmSwapModel {
	from: {
		tokenName: string;
		quantity: number;
		fiatValue: number;
	};
	to: {
		tokenName: string;
		quantity: number;
		fiatValue: number;
	};
	priceImpact: number;
	slippage: number;
	minReceived: number;
	gasFee: number;
}
