export interface StakingPoolInfoModel {
	stakings: Array<StakingPoolInfoType>;
}

interface StakingPoolInfoType {
	period: number;
	total_apr: number;
	benefits: Array<string>;
}
