export interface StakingPoolInfoModel {
	stakings: Array<StakingPoolInfoType>;
}

interface StakingPoolInfoType {
	period: number;
	totalApr: number;
	benefits: Array<string>;
}
