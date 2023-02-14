import { returnNullWithLog } from "@/common/utils/error-util";
import { TransactionHashModelMapper } from "@/models/common/mapper/transaction-hash-model-mapper";
import { LiquidityDetailModel } from "@/models/liquidity/liquidity-detail-model";
import { LiquidityModelMapper } from "@/models/liquidity/mapper/liquildity-model-mapper";
import { TokenPairModelMapper } from "@/models/token/mapper/token-pair-model-mapper";
import { TokenDefaultModel } from "@/models/token/token-default-model";
import { TokenPairModel } from "@/models/token/token-pair-model";
import { LiquidityRepository } from "@/repositories/liquidity";

export class LiquidityService {
	private liquidityRepository: LiquidityRepository;

	constructor(liquidityRepository: LiquidityRepository) {
		this.liquidityRepository = liquidityRepository;
	}

	/**
	 * Get single liquidity information.
	 *
	 * @param liquidityId
	 * @returns	Liquidity data model, Return null on error
	 */
	public getLiquidity = (
		liquidityId: string,
	): Promise<LiquidityDetailModel | null> => {
		return this.liquidityRepository
			.getLiquidityById(liquidityId)
			.then(LiquidityModelMapper.fromDetailResponse)
			.catch(returnNullWithLog);
	};

	/**
	 * Add liquidity to the liquidity pool.
	 *
	 * @param liquidity Liquidity information to add
	 * @param options Option to add liquidity
	 * @returns transaction hash
	 */
	public addLiquidity = (
		liquidity: TokenPairModel,
		options: {
			rangeType: "ACTIVE" | "PASSIVE" | "CUSTOM";
			feeRate: number;
			minRate: number;
			maxRate: number;
		},
	) => {
		const request = {
			liquidity: TokenPairModelMapper.toRequest(liquidity),
			options,
		};
		return this.liquidityRepository
			.addLiquidityBy(request)
			.then(TransactionHashModelMapper.fromResponse)
			.catch(returnNullWithLog);
	};

	/**
	 * Remove the provided liquidity list.
	 *
	 * @param liquidityIds List of liquid IDs to remove
	 * @returns transaction hash
	 */
	public removeLiquidities = (liquidityIds: Array<string>) => {
		const request = {
			liquidityIds,
		};
		return this.liquidityRepository
			.removeLiquiditiesBy(request)
			.then(TransactionHashModelMapper.fromResponse)
			.catch(returnNullWithLog);
	};

	/**
	 * Get user's liquidities information.
	 *
	 * @param address User's address
	 * @returns Liquidity data models
	 */
	public getLiquiditiesByAddress = (address: string) => {
		return this.liquidityRepository
			.getLiquiditiesByAddress(address)
			.then(LiquidityModelMapper.fromDetailListResponse)
			.catch(returnNullWithLog);
	};

	/**
	 * Get user's liquidities information in pool.
	 *
	 * @param address User's address
	 * @param poolId Pool ID
	 * @returns Liquidity data models
	 */
	public getLiquiditiesByAddressAndPoolId = (
		address: string,
		poolId: string,
	) => {
		return this.liquidityRepository
			.getLiquiditiesByAddressAndPoolId(address, poolId)
			.then(LiquidityModelMapper.fromDetailListResponse)
			.catch(returnNullWithLog);
	};

	public getSummaryPooledByLiquidities = (
		liquidities: Array<LiquidityDetailModel>,
	) => {
		const token0 = liquidities
			.map(liquidity => liquidity.liquidity.token0)
			.reduce(LiquidityService.addAllTokenAmounts);
		const token1 = liquidities
			.map(liquidity => liquidity.liquidity.token1)
			.reduce(LiquidityService.addAllTokenAmounts);

		return [token0, token1];
	};

	public getSummaryUnclaimedByLiquidities = (
		liquidities: Array<LiquidityDetailModel>,
	) => {
		const rewardSwapFeeToken0 = liquidities
			.map(liquidity => liquidity.reward.swap.token0)
			.reduce(LiquidityService.addAllTokenAmounts);
		const rewardSwapFeeToken1 = liquidities
			.map(liquidity => liquidity.reward.swap.token1)
			.reduce(LiquidityService.addAllTokenAmounts);

		return [rewardSwapFeeToken0, rewardSwapFeeToken1];
	};

	public getAvailStakeLiquidities = (
		address: string,
		poolId: string,
		period: number,
	) => {
		return this.liquidityRepository
			.getAvailStakeLiquiditiesBy(address, period, poolId)
			.then(LiquidityModelMapper.fromDetailListResponse)
			.catch(returnNullWithLog);
	};

	public getAvailUnstakeLiquidities = (
		address: string,
		poolId: string,
		period: number,
	) => {
		return this.liquidityRepository
			.getAvailUnstakeLiquiditiesBy(address, period, poolId)
			.then(LiquidityModelMapper.fromDetailListResponse)
			.catch(returnNullWithLog);
	};

	private static addAllTokenAmounts = (
		total: TokenDefaultModel,
		current: TokenDefaultModel,
	) => {
		{
			console.log("current", current.amount?.value.toString() ?? 0);
			if (total.amount && current.amount) {
				total.amount.value = total.amount.value.plus(current.amount.value);
				return total;
			}
			return total;
		}
	};
}
