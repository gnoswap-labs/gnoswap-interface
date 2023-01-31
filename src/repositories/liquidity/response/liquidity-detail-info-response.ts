export interface LiquidityDetailInfoResponse {
	token_pair_logo: Array<string>;

	token_pair_name: Array<string>;

	fee: "0.01%" | "0.05%" | "0.3%" | "1%";

	label: "Incentivized" | "Non-incentivized" | "External Incentivized";

	liquidity: SummaryLiquidity;

	volume: SummaryVolume;

	apr: SummaryApr;
}

interface SummaryLiquidity {
	usd_value: number;
	changed_of_24h: number;
}

interface SummaryVolume {
	usd_value: number;
	changed_of_24h: number;
}

interface SummaryApr {
	fiat_value: number; // fees + rewards = fiat_value
	fees: number;
	rewards: number;
}
