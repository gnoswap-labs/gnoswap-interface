import BigNumber from "bignumber.js";

export interface AmountType {
	value: BigNumber;
	denom: string;
}

export interface AmountNumberType {
	value: number;
	denom: string;
}
export interface SearchOption {
	keyword: string;
	type: string;
}

export interface RecentSearchOption {
	keyword: string;
	address?: string;
}
