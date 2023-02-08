import { TokenPairModel } from "./../../../token/token-pair-model";

export interface LiquidityCompositionModel {
	tokenPair: TokenPairModel;
	tokenRate: TokenPairRate;
}

interface TokenPairRate {
	rateToken0: number;
	rateToken1: number;
}
