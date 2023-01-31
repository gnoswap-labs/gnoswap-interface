export interface PoolDetailListResponse {
	pools: Array<PoolInfo>;
}

interface PoolInfo {
	pool_id: string;

	token_pair_logo: Array<string>;

	token_pair_name: Array<string>;

	fee: "0.01%" | "0.05%" | "0.3%" | "1%";

	status: "Staked" | "Unstaking" | "Unstaked";

	value: number;

	apr: number;

	details: PoolDetailInfo;
}

interface PoolDetailInfo {
	current_price: number;

	liquidity_range: "in" | "out";

	min_price: number;

	max_price: number;
}
