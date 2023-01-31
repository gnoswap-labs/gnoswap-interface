import {
	FeeOptions,
	LiquidityRangeOptions,
} from "./../common/values/data-constant";
import { StakedOptions } from "@/common/values/data-constant";

export interface MyPoolPositionModel {
	tokenPairLogo: Array<string>;
	tokenPairName: Array<string>;
	fee: FeeOptions;
	status: StakedOptions;
	value: number;
	apr: number;
	details: {
		currentPrice: number;
		liquidityRange: LiquidityRangeOptions;
		minPrice: number;
		maxPrice: number;
	};
}
