export interface TotalStakingResultResponse {
	total: number;

	period: string;

	apr: string;

	liquidities: Array<StakingLiquidityInfo>;
}

interface StakingLiquidityInfo {
	liquidity_id: string;
	logo: string;
	denom: string;
	liquidity: number;
	usd_value: number;
}
