export interface StakingListResponse {
	stakes: Array<StakingInfo>;
}

interface StakingInfo {
	stake_id: string;

	logo: string;

	period: string;

	liquidity: number;
}
