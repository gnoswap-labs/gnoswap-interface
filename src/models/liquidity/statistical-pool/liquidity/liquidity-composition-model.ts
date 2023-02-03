import { TokenPairModel } from "./../../../token/token-pair-model";

export interface LiquidityCompositionModel {
	tokenPair: TokenPairModel;
	tokenRate: TokenPairRate;
}

interface TokenPairRate {
	rateTokenA: number;
	rateTokenB: number;
}
