import { LiquidityProvideOptions } from "./../../common/values/data-constant";
import { TokenPairModel } from "./../token/token-pair-model";
import { FeeOptions, StakedOptions } from "@/common/values/data-constant";

export interface PoolPositionModel {
	hits: number;
	total: number;
	pools: Array<PoolPositionType>;
}

interface PoolPositionType {
	pool_id: string;
	liquidity_id: string;
	liquidity_type: LiquidityProvideOptions;
	pool_position: PoolPairPositionType;
	current_pool: CurrentPoolType;
	rate_graph: RangeGraphType;
	price_graph: PriceGraphType;
}

interface PoolPairPositionType {
	token_pair: TokenPairModel;
	fee_rate: FeeOptions;
	stake_type: StakedOptions;
}

interface RangeGraphType {
	max_rate: FeeOptions;
	min_rate: FeeOptions;
}

interface PriceGraphType {
	tick: number;
	value: number;
}

interface CurrentPoolType {
	liquidity_id: string;
	in_range: boolean;
	token_pair: TokenPairModel;
	current_price: number;
	min_price: number;
	max_price: number;
}
