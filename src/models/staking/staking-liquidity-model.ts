import { TokenPairModel } from "./../token/token-pair-model";
import {
	LiquidityProvideOptions,
	StakedOptions,
} from "@/common/values/data-constant";

export interface StakingLiquidityModel {
	staking_liquidities: Array<StakingLiquidityType>;
}

interface StakingLiquidityType {
	pool_id: string;
	liquidity_id: string;
	liquidity_type: LiquidityProvideOptions;
	stake_type: StakedOptions;
	token_pair: TokenPairModel;
	in_range: boolean;
	min_price: number;
	max_price: number;
	rewards: {
		swap: TokenPairModel;
		staking: TokenPairModel;
	};
	apr: TokenPairModel;
}
