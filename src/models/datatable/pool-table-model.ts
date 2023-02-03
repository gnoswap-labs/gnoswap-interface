import { TokenPairModel } from "./../token/token-pair-model";
import { IncentivizedOptions, FeeOptions } from "@/common/values/data-constant";

export interface PoolTableModel {
	hits: number;
	total: number;
	pools: Array<PoolDetailType>;
}

interface PoolDetailType {
	poolId: string;
	tokenPair: TokenPairModel;
	feeRate: FeeOptions;
	liquidity: number;
	apr: number;
	volumn24h: number;
	fees24h: number;
	rewards: Array<string>;
	incentiveType: IncentivizedOptions;
}
