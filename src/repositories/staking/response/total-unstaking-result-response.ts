export interface TotalUnstakingResultResponse {
	total: number;

	period: string;

	apr: string;

	liquidities: Array<UnstakingLiquidityInfo>;

	unclaimed_rewards: Array<UnclaimedRewardInfo>;
}

interface UnstakingLiquidityInfo {
	liquidity_id: string;
	logo: string;
	denom: string;
	amount: number;
	usd_value: number;
}

interface UnclaimedRewardInfo {
	denom: string;
	logo: string;
	amount: number;
	usd_value: number;
}
