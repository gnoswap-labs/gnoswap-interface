import {
	generateId,
	generateIndex,
	generateNumber,
	generateNumberPlus,
	generateToken0,
	generateToken1,
	generateTokenMetas,
} from "@/common/utils/test-util";
import {
	PoolListResponse,
	PoolInfoResposne,
	PoolRepository,
	PoolSummaryAprResposne,
	PoolSummaryLiquidityResposne,
	PoolSummaryVolumeResposne,
	PoolChartResopnse,
} from ".";

export class PoolRepositoryMock implements PoolRepository {
	getPools = async (option?: {} | undefined): Promise<PoolListResponse> => {
		return PoolRepositoryMock.generatePools();
	};

	getPoolsByAddress = async (address: string): Promise<PoolListResponse> => {
		return PoolRepositoryMock.generatePools();
	};

	getPoolById = async (poolId: string): Promise<PoolInfoResposne> => {
		return PoolRepositoryMock.generatePoolInfo();
	};

	getPoolChartTicks = async (poolId: string): Promise<PoolChartResopnse> => {
		return {
			pool_id: generateId(),
			ticks: [],
		};
	};

	getPoolSummaryLiquidityById =
		async (): Promise<PoolSummaryLiquidityResposne> => {
			const token1Rate = generateNumber(0, 100);
			return {
				changed_of_24h: generateNumber(1000000000, 90000000000),
				liquidity: PoolRepositoryMock.generateTokenPair(),
				pooled_rate_token0: 100 - token1Rate,
				pooled_rate_token1: token1Rate,
			};
		};

	getPoolSummaryVolumeById = async (): Promise<PoolSummaryVolumeResposne> => {
		return {
			changed_of_24h: generateNumber(1000000000, 90000000000),
			volume: generateNumber(1000000000, 90000000000),
		};
	};

	getPoolSummaryAprById = async (): Promise<PoolSummaryAprResposne> => {
		return {
			apr: generateNumber(1000, 90000000),
			fees: generateNumber(1000, 90000000),
			reward_rate: generateNumber(0, 10),
		};
	};

	private static generatePools = () => {
		const pools = new Array(generateNumber(5, 40)).map(
			PoolRepositoryMock.generatePoolInfo,
		);

		return {
			total: pools.length,
			hits: pools.length,
			pools,
		};
	};

	private static generatePoolInfo = () => {
		return {
			pool_id: `${generateNumber(0, 100000)}`,
			incentive_type: [
				"INCENTIVZED",
				"NON_INCENTIVZED",
				"EXTERNAL_INCENTIVZED",
			][generateIndex(3)] as
				| "INCENTIVZED"
				| "NON_INCENTIVZED"
				| "EXTERNAL_INCENTIVZED",
			fee_rate: 0.01,
			liquidity: PoolRepositoryMock.generateTokenPair(),
			apr: generateNumber(0, 100),
			volumn_24h: generateNumber(1000000000, 90000000000),
			fees_24h: generateNumber(100, 900000000),
			rewards: PoolRepositoryMock.generateTokenPair(),
		};
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
