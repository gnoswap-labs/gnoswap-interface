import { FeeOptions, IncentivizedOptions } from "@/common/values/data-constant";

export interface LiquidityDetailInfoResponse {
	token_pair_logo: Array<string>;

	token_pair_name: Array<string>;

	fee: FeeOptions;

	label: IncentivizedOptions;

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
