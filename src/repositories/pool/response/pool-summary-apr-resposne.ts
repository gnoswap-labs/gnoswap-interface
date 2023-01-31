export interface PoolSummaryAprResposne {
	fiat_value: number; // fees + rewards = fiat_value

	fees: number;

	rewards: number;
}
