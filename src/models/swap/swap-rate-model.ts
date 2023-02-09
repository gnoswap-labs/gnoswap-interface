import { BigNumber } from "bignumber.js";
import { ExactTypeOption } from "@/common/values/data-constant";
export interface SwapRateModel {
	token0Symbol: string;
	token0Amount: BigNumber;
	token1Symbol: string;
	token1Amount: BigNumber;
	type: ExactTypeOption;
}
