import { AprModel } from "./apr";
import { LiquidityModel } from "./liquidity";
import { PoolPairModel } from "./pool-pair";
import { VolumnModel } from "./volumn";

export interface StatisticalPoolModel {
	pool_pair: PoolPairModel;
	liquidity: LiquidityModel;
	volumn: VolumnModel;
	apr: AprModel;
}
