import BigNumber from "bignumber.js";

interface Amount {
	value: BigNumber;
	denom: string;
}

interface DenomConfig {
	defaultDenom: string;
	defaultRate: BigNumber;
	minimalDenom: string;
	minimalRate: BigNumber;
}

export const toMinimalDenom = (amount: Amount, denomConfig: DenomConfig) => {
	const { defaultRate, minimalDenom, minimalRate } = denomConfig;
	if (isMinimalDenom(amount, denomConfig)) {
		return amount;
	}
	const amountValue = amount.value;
	const rate = defaultRate.dividedBy(minimalRate);
	const minimalAmount = amountValue.multipliedBy(rate);
	return {
		amont: minimalAmount,
		denom: minimalDenom,
	};
};

export const toDefaultDenom = (amount: Amount, denomConfig: DenomConfig) => {
	const { defaultRate, defaultDenom, minimalRate } = denomConfig;
	if (isDefaultDenom(amount, denomConfig)) {
		return amount;
	}
	const amountValue = amount.value;
	const rate = minimalRate.dividedBy(defaultRate);
	const defaultAmount = amountValue.multipliedBy(rate);
	return {
		amont: defaultAmount,
		denom: defaultDenom,
	};
};

const isMinimalDenom = (amount: Amount, denomConfig: DenomConfig) => {
	const denom = amount.denom;
	return denom.toLowerCase() === denomConfig.minimalDenom.toLowerCase();
};

const isDefaultDenom = (amount: Amount, denomConfig: DenomConfig) => {
	const denom = amount.denom;
	return denom.toUpperCase() === denomConfig.defaultDenom.toUpperCase();
};
