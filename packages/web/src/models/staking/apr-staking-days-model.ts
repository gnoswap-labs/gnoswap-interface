export interface AprStakingDaysModel {
	stakingDays: Array<AprStakingDaysType>;
}

interface AprStakingDaysType {
	period: number;
	totalApr: number;
	benefits: Array<string>;
}
