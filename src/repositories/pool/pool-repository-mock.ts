import {
	generateInteger,
	generateNumber,
	generateNumberPlus,
	generateToken0,
	generateToken1,
} from "@/common/utils/test-util";
import {
	PoolListResponse,
	PoolInfoResponse,
	PoolRepository,
	PoolSummaryAprResponse,
	PoolSummaryLiquidityResponse,
	PoolSummaryVolumeResponse,
	PoolChartResopnse,
} from ".";

import PoolDetailDatas from "./mock/pool-details.json";

export class PoolRepositoryMock implements PoolRepository {
	getPoolById = async (poolId: string): Promise<PoolInfoResponse> => {
		const { pools } = PoolDetailDatas;
		const pool = pools.find(p => p.pool_id === poolId);
		if (!pool) {
			throw new Error("Not found pool");
		}
		return pool as PoolInfoResponse;
	};

	getPools = async (option?: {} | undefined): Promise<PoolListResponse> => {
		return PoolDetailDatas as PoolListResponse;
	};

	getPoolsByAddress = async (address: string): Promise<PoolListResponse> => {
		return PoolDetailDatas as PoolListResponse;
	};

	getPoolChartTicks = async (poolId: string): Promise<PoolChartResopnse> => {
		return {
			pool_id: poolId,
			ticks: PoolRepositoryMock.generateTicks(),
		};
	};

	getPoolSummaryLiquidityById = async (
		poolId: string,
	): Promise<PoolSummaryLiquidityResponse> => {
		const token1Rate = generateNumber(0, 100);
		return {
			changed_of_24h: generateNumber(1000000000, 90000000000),
			liquidity: PoolRepositoryMock.generateTokenPair(),
			pooled_rate_token0: 100 - token1Rate,
			pooled_rate_token1: token1Rate,
		};
	};

	getPoolSummaryVolumeById = async (
		poolId: string,
	): Promise<PoolSummaryVolumeResponse> => {
		return {
			changed_of_24h: generateNumber(1000000000, 90000000000),
			volume: generateNumber(1000000000, 90000000000),
		};
	};

	getPoolSummaryAprById = async (
		poolId: string,
	): Promise<PoolSummaryAprResponse> => {
		return {
			apr: generateNumber(1000, 90000000),
			fees: generateNumber(1000, 90000000),
			reward_rate: generateNumber(0, 10),
		};
	};

	private static generateTicks = () => {
		const ticks = [...new Array(20)].map((_, index) => {
			return {
				tick: index,
				value: generateInteger(0, 100),
			};
		});
		return ticks;
	};

	private static generateTokenPair = () => {
		const token0Amount = generateNumberPlus();
		const token1Amount = generateNumberPlus();
		const total = token0Amount + token1Amount;
		return {
			total,
			token0: generateToken0(),
			token1: generateToken1(),
		};
	};
}
