import { TokenPairModel } from "./../../../token/token-pair-model";
import { FeeOptions, IncentivizedOptions } from "@/common/values/data-constant";

export interface PoolPairModel {
	poolId: string;
	feeRate: FeeOptions;
	tokenPair: TokenPairModel;
	incentiveType: IncentivizedOptions;
}
