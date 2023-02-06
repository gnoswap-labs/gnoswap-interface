export interface StakingPeriodListResponse {
	periods: Array<StakingPeriodInfo>;
}

export interface StakingPeriodInfo {
	period: number;

	apr: number;

	benefits: Array<string>;
}
