import { TokenPairModel } from "./../../../token/token-pair-model";

export interface LiquidityCompositionModel {
	token_pair: TokenPairModel;
	token_rate: TokenPairRate;
}

interface TokenPairRate {
	rate_tokenA: number;
	rate_tokenB: number;
}
