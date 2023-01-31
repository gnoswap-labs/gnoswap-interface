import { generateNumber, generateTokenMetas } from "@/common/utils/test-util";
import {
	PoolDetailListResponse,
	PoolInfoResposne,
	RewardPoolListResponse,
	PoolRepository,
	PoolSummaryAprResposne,
	PoolSummaryLiquidityResposne,
	PoolSummaryVolumeResposne,
} from ".";

export class PoolRepositoryMock implements PoolRepository {
	getRewardPools = async (): Promise<RewardPoolListResponse> => {
		return PoolRepositoryMock.generatePools();
	};

	getPools = async (
		option?: {} | undefined,
	): Promise<PoolDetailListResponse> => {
		return PoolRepositoryMock.generatePools();
	};

	getPoolsByAddress = async (
		address: string,
	): Promise<PoolDetailListResponse> => {
		return PoolRepositoryMock.generatePools();
	};

	getPoolById = async (poolId: string): Promise<PoolInfoResposne> => {
		return PoolRepositoryMock.generatePoolInfo();
	};

	getPoolSummaryLiquidityById =
		async (): Promise<PoolSummaryLiquidityResposne> => {
			return {
				changed_of_24h: generateNumber(1000000000, 90000000000),
				fiat_value: generateNumber(1000000000, 90000000000),
			};
		};

	getPoolSummaryVolumeById = async (): Promise<PoolSummaryVolumeResposne> => {
		return {
			changed_of_24h: generateNumber(1000000000, 90000000000),
			fiat_value: generateNumber(1000000000, 90000000000),
		};
	};

	getPoolSummaryAprById = async (): Promise<PoolSummaryAprResposne> => {
		return {
			fiat_value: generateNumber(1000, 90000000),
			fees: generateNumber(1000, 90000000),
			rewards: generateNumber(1000, 90000000),
		};
	};

	private static generatePools = () => {
		const pools = new Array(generateNumber(5, 40)).map(
			PoolRepositoryMock.generatePoolInfo,
		);

		return {
			pools,
		};
	};

	private static generatePoolInfo = () => {
		const { images, names } = generateTokenMetas();

		return {
			pool_id: `${generateNumber(0, 100000)}`,
			token_pair_logo: images,
			token_pair_name: names,
			fee: "0.01%" as "0.01%" | "0.05%" | "0.3%" | "1%",
			liquidity: generateNumber(100, 2000),
			apr: generateNumber(0, 100),
			trading_volumn_24h: generateNumber(1000000000, 90000000000),
			fees_24h: generateNumber(100, 900000000),
			status: "Staked" as "Staked" | "Unstaking" | "Unstaked",
			value: generateNumber(100, 2000),
			label: "Incentivized" as
				| "Incentivized"
				| "Non-incentivized"
				| "External Incentivized",
			details: {
				current_price: generateNumber(100, 2000),
				liquidity_range: "in" as "in" | "out",
				min_price: generateNumber(100, 2000),
				max_price: generateNumber(0, 100),
			},
		};
	};
}
