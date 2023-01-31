import {
	PoolDetailListResponse,
	PoolInfoResposne,
	PoolListResponse,
	PoolRepository,
	PoolSummaryAprResposne,
	PoolSummaryLiquidityResposne,
	PoolSummaryVolumeResposne,
} from ".";

export class PoolRepositoryMock implements PoolRepository {
	getRewardPools = async (): Promise<PoolListResponse> => {
		return {};
	};

	getPools = async (
		option?: {} | undefined,
	): Promise<PoolDetailListResponse> => {
		return {};
	};

	getPoolsByAddress = async (
		address: string,
	): Promise<PoolDetailListResponse> => {
		return {};
	};

	getPoolById = async (poolId: string): Promise<PoolInfoResposne> => {
		return {};
	};

	getPoolSummaryLiquidityById =
		async (): Promise<PoolSummaryLiquidityResposne> => {
			return {};
		};

	getPoolSummaryVolumeById = async (): Promise<PoolSummaryVolumeResposne> => {
		return {};
	};

	getPoolSummaryAprById = async (): Promise<PoolSummaryAprResposne> => {
		return {};
	};
}
