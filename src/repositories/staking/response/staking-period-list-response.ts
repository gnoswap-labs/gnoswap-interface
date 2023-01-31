export interface StakingPeriodListResponse {
	periods: Array<StakingPeriodInfo>;
}

interface StakingPeriodInfo {
	period: number;

	apr: number;

	benefits: Array<string>;
}
