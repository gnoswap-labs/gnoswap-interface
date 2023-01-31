import {
	generateNumber,
	generateNumberPlus,
	generateTokenMetas,
	generateTxHash,
} from "@/common/utils/test-util";
import {
	LpTokenDetailInfoResponse,
	LpTokenListResponse,
	StakeResponse,
	StakingListResponse,
	StakingRepository,
	TotalStakingResultResponse,
	TotalUnstakingResultResponse,
	UnstakeResponse,
	StakingPeriodListResponse,
} from ".";
import { StakeRequest } from "./request";

export class StakingRepositoryMock implements StakingRepository {
	public getStakingPeriods = async (): Promise<StakingPeriodListResponse> => {
		return {
			periods: [
				{
					period: 7,
					apr: 88,
					benefits: ["Emission", "Extra Fees"],
				},
				{
					period: 14,
					apr: 130,
					benefits: ["Emission", "Extra Fees"],
				},
				{
					period: 21,
					apr: 202,
					benefits: ["Emission", "Extra Fees"],
				},
			],
		};
	};

	public getLPTokensByAddress = async (
		address: string,
	): Promise<LpTokenListResponse> => {
		return StakingRepositoryMock.generateLiquidities();
	};

	public getLPTokenDetailBy = async (
		liquidityId: string,
		address: string,
	): Promise<LpTokenDetailInfoResponse> => {
		return StakingRepositoryMock.generateLiquidity();
	};

	public getStakesByAddress = async (
		address: string,
	): Promise<StakingListResponse> => {
		return StakingRepositoryMock.generateStakes();
	};

	public getTotalStakingResultBy = async (
		liquidityIds: string[],
		period: string,
	): Promise<TotalStakingResultResponse> => {
		return StakingRepositoryMock.generateStakeResult();
	};

	public stake = async (request: StakeRequest): Promise<StakeResponse> => {
		return {
			tx_hash: generateTxHash(),
		};
	};

	public getTotalUnstakingResultBy = async (
		liquidityIds: string[],
		period: string,
	): Promise<TotalUnstakingResultResponse> => {
		return StakingRepositoryMock.generateStakeResult();
	};

	public unstake = async (request: StakeRequest): Promise<UnstakeResponse> => {
		return {
			tx_hash: generateTxHash(),
		};
	};

	private static generateLiquidities = () => {
		const liquidities = new Array(generateNumber(5, 40)).map(
			StakingRepositoryMock.generateLiquidity,
		);
		return {
			liquidities,
		};
	};

	private static generateLiquidity = () => {
		const { images, names } = generateTokenMetas();
		const balance = generateNumber(0, 100000);
		return {
			liquidity_id: `${generateNumber(0, 100000)}`,
			logo: images[0],
			liquidity: generateNumber(0, 100000),
			amount: generateNumber(0, 100000),
			denom: names[0],
			period: "7",
			balance: balance,
			usd_value: balance * 0.7,
		};
	};

	private static generateStakes = () => {
		const stakes = new Array(generateNumber(5, 10)).map(
			StakingRepositoryMock.generateStake,
		);
		return {
			stakes,
		};
	};

	private static generateStake = () => {
		const { images } = generateTokenMetas();
		return {
			stake_id: `${generateNumber(0, 100000)}`,
			logo: images[0],
			period: "7",
			liquidity: generateNumber(0, 100000),
		};
	};

	private static generateStakeResult = () => {
		const items = new Array(generateNumber(5, 40));
		const liquidities = items.map(StakingRepositoryMock.generateLiquidity);
		const unclaimedRewards = items.map(StakingRepositoryMock.generateLiquidity);
		return {
			total: liquidities.length,
			period: "7",
			apr: `${generateNumber(0, 100)}`,
			liquidities,
			unclaimed_rewards: unclaimedRewards,
		};
	};
}
