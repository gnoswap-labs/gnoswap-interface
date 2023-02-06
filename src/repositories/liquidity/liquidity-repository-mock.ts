import {
	generateBoolean,
	generateId,
	generateIndex,
	generateInteger,
	generateNumberPlus,
	generateToken0,
	generateToken1,
	generateTokenMetas,
	generateTxHash,
} from "@/common/utils/test-util";
import {
	AddLiquidityResponse,
	ClaimRewardResponse,
	LiquidityDetailInfoResponse,
	LiquidityDetailListResponse,
	LiquidityRepository,
	LiquidityRewardResponse,
	RemoveLiquidityResponse,
} from ".";
import {
	AddLiquidityRequest,
	RemoveLiquidityRequest,
	ClaimRewardReqeust,
} from "./request";

export class LiquidityRepositoryMock implements LiquidityRepository {
	public getLiquidityById = async (
		liquidityId: string,
	): Promise<LiquidityDetailInfoResponse> => {
		return LiquidityRepositoryMock.generateLiquidity();
	};

	public getLiquiditiesByAddress = async (
		address: string,
	): Promise<LiquidityDetailListResponse> => {
		const liquidities = [...new Array(generateInteger(5, 40))].map(
			LiquidityRepositoryMock.generateLiquidity,
		);
		return {
			liquidities,
		};
	};

	public getAvailStakeLiquiditiesBy = async (
		poolId: string,
		period: number,
		address: string,
	): Promise<LiquidityDetailListResponse> => {
		const liquidities = [...new Array(generateInteger(5, 40))].map(
			LiquidityRepositoryMock.generateLiquidity,
		);
		return {
			liquidities,
		};
	};

	public getAvailUnstakeLiquiditiesBy = async (
		poolId: string,
		period: number,
		address: string,
	): Promise<LiquidityDetailListResponse> => {
		const liquidities = [...new Array(generateInteger(5, 40))].map(
			LiquidityRepositoryMock.generateLiquidity,
		);
		return {
			liquidities,
		};
	};

	public addLiquidityBy = async (
		request: AddLiquidityRequest,
	): Promise<AddLiquidityResponse> => {
		return {
			tx_hash: generateTxHash(),
		};
	};

	public removeLiquiditiesBy = async (
		request: RemoveLiquidityRequest,
	): Promise<RemoveLiquidityResponse> => {
		return {
			tx_hash: generateTxHash(),
		};
	};

	public getLiquidityRewardByAddressAndPoolId = async (
		address: string,
		poolId: string,
	): Promise<LiquidityRewardResponse> => {
		return LiquidityRepositoryMock.generateLiquidity();
	};

	public claimRewardByPoolId = async (
		poolId: string,
	): Promise<ClaimRewardResponse> => {
		return {
			tx_hash: generateTxHash(),
		};
	};

	private static generateLiquidity = () => {
		const liquidityTypes = ["NONE", "PROVIDED"];
		const stakeTypes = ["NONE", "STAKED", "UNSTAKING"];
		return {
			pool_id: generateId(),
			liquidity_id: generateId(),
			liquidity_type: liquidityTypes[generateIndex(2)] as "NONE" | "PROVIDED",
			stake_type: stakeTypes[generateIndex(3)] as
				| "NONE"
				| "STAKED"
				| "UNSTAKING",
			is_claim: generateBoolean(),
			in_range: generateBoolean(),
			max_rate: 2.4,
			min_rate: 0.14,
			fee_rate: 0.5,
			liquidity: LiquidityRepositoryMock.generateTokenPair(),
			apr: LiquidityRepositoryMock.generateTokenPair(),
			total_balance: LiquidityRepositoryMock.generateTokenPair(),
			daily_earning: LiquidityRepositoryMock.generateTokenPair(),
			reward: {
				staking: LiquidityRepositoryMock.generateTokenPair(),
				swap: LiquidityRepositoryMock.generateTokenPair(),
			},
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
