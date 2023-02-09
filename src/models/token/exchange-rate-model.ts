import { BigNumber } from "bignumber.js";

export interface ExchangeRateModel {
	tokenId: string;
	rates: Array<ExchangeRateToBigNumType>;
}

export interface ExchangeRateToBigNumType {
	tokenId: string;
	rate: BigNumber;
}
