import { LiquidityCompositionModel } from "./liquidity-composition-model";

export interface LiquidityModel {
	liquidity: number;
	change24h: number;
	composition: LiquidityCompositionModel;
}
