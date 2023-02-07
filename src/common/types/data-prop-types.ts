import BigNumber from "bignumber.js";

export interface AmountType {
	value: BigNumber;
	denom: string;
}

export interface AmountNumberType {
	value: number;
	denom: string;
}
