import { TokenPairModel } from "./../token/token-pair-model";
import { IncentivizedOptions, FeeOptions } from "@/common/values/data-constant";

export interface PoolTableModel {
	hits: number;
	total: number;
	pools: Array<PoolDetailType>;
}

interface PoolDetailType {
	pool_id: string;
	token_pair: TokenPairModel;
	fee_rate: FeeOptions;
	liquidity: number;
	apr: number;
	volumn_24h: number;
	fees_24h: number;
	rewards: Array<string>;
	incentive_type: IncentivizedOptions;
}
