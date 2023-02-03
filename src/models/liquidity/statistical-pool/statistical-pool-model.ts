import { AprModel } from "./apr";
import { LiquidityModel } from "./liquidity";
import { PoolPairModel } from "./pool-pair";
import { VolumnModel } from "./volumn";

export interface StatisticalPoolModel {
	poolPair: PoolPairModel;
	liquidity: LiquidityModel;
	volumn: VolumnModel;
	apr: AprModel;
}
