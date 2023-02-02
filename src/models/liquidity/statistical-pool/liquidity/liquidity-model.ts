import { LiquidityCompositionModel } from "./liquidity-composition-model";

export interface LiquidityModel {
	liquidity: number;
	change_24h: number;
	composition: LiquidityCompositionModel;
}
