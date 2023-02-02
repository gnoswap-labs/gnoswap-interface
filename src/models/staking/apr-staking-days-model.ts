export interface AprStakingDaysModel {
	staking_days: Array<AprStakingDaysType>;
}

interface AprStakingDaysType {
	period: number;
	total_apr: number;
	benefits: Array<string>;
}
