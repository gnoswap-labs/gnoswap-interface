import { BigNumber } from "bignumber.js";

export interface SwapExpectedResultModel {
	priceImpact: number;
	minReceived: BigNumber;
	gasFee: BigNumber;
}
