import { IncentivizedOptions } from "@/common/values/data-constant";
import { TokenDefaultModel } from "../token/token-default-model";
import { TokenPairModel } from "../token/token-pair-model";

export interface PoolModel {
	poolId: string;

	feeRate: number;

	liquidity: TokenPairModel;

	rewards: Array<TokenDefaultModel>;

	incentivizedType: IncentivizedOptions;
}
