export interface RewardPoolListResponse {
	pools: Array<RewardPoolInfo>;
}

interface RewardPoolInfo {
	token_pair_logo: Array<string>;

	token_pair_name: Array<string>;

	fee: "0.01%" | "0.05%" | "0.3%" | "1%";

	liquidity: number;

	apr: number;

	trading_volumn_24h: number;

	fees_24h: number;
}
