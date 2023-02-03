import { PoolModel } from "./pool-model";

export interface PoolDetailModel extends PoolModel {
	apr: number;

	volumn24h: number;

	fees24h: number;
}
