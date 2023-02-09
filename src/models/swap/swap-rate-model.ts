import { BigNumber } from "bignumber.js";
import { ExactTypeOption } from "@/common/values/data-constant";

export interface SwapRateRequestModel {
	token0Symbol: string;
	token0Amount: BigNumber;
	token1Symbol: string;
	token1Amount: BigNumber;
	type: ExactTypeOption;
}

export interface SwapRateResponseModel {
	token0Symbol: string;
	token0Amount: string;
	token1Symbol: string;
	token1Amount: string;
	type: ExactTypeOption;
}
