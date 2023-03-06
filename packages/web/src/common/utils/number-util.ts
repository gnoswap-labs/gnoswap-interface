import BigNumber from "bignumber.js";

export const toNumberFormat = (
	value: BigNumber | string | number,
	decimalPlaces?: number,
) => {
	const bigNumber = BigNumber(value);
	if (decimalPlaces) {
		return bigNumber.decimalPlaces(decimalPlaces).toFormat();
	}
	return bigNumber.toFormat();
};
