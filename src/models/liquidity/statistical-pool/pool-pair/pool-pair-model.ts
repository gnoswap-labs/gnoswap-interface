import { TokenPairModel } from "./../../../token/token-pair-model";
import { FeeOptions, IncentivizedOptions } from "@/common/values/data-constant";

export interface PoolPairModel {
	pool_id: string;
	fee_rate: FeeOptions;
	token_pair: TokenPairModel;
	incentive_type: IncentivizedOptions;
}
