import { TransactionHashModelMapper } from "@/models/common/mapper/transaction-hash-model-mapper";
import { LiquidityDetailModel } from "@/models/liquidity/liquidity-detail-model";
import { LiquidityModelMapper } from "@/models/liquidity/mapper/liquildity-model-mapper";
import { LiquidityRewardModelMapper } from "@/models/liquidity/mapper/liquildity-reward-model-mapper";
import { TokenPairModelMapper } from "@/models/token/mapper/token-pair-model-mapper";
import { TokenPairModel } from "@/models/token/token-pair-model";
import { LiquidityRepository } from "@/repositories/liquidity";

export class LiquidityService {
	private liquidityRepository: LiquidityRepository;

	constructor(liquidityRepository: LiquidityRepository) {
		this.liquidityRepository = liquidityRepository;
	}

	public getLiquidity = (liquidityId: string) => {
		return this.liquidityRepository
			.getLiquidityById(liquidityId)
			.then(LiquidityModelMapper.fromDetailResponse);
	};

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
			liquidity: TokenPairModelMapper.toSimple(liquidity),
			options,
		};
		return this.liquidityRepository
			.addLiquidityBy(request)
			.then(TransactionHashModelMapper.fromResponse);
	};

	public removeLiquidities = (liquidityIds: Array<string>) => {
		const request = {
			liquidityIds,
		};
		return this.liquidityRepository
			.removeLiquiditiesBy(request)
			.then(TransactionHashModelMapper.fromResponse);
	};

	public getLiquiditiesByAddress = (address: string) => {
		return this.liquidityRepository
			.getLiquiditiesByAddress(address)
			.then(LiquidityModelMapper.fromDetailListResponse)
			.catch<Array<LiquidityDetailModel>>(error => {
				console.log(error);
				return [];
			});
	};

	public getLiquiditiesByAddressAndPoolId = (
		address: string,
		poolId: string,
	) => {
		return this.liquidityRepository
			.getLiquiditiesByAddress(address)
			.then(LiquidityModelMapper.fromDetailListResponse)
			.catch<Array<LiquidityDetailModel>>(error => {
				console.log(error);
				return [];
			});
	};

	public getAvailStakeLiquiditiesBy = (
		address: string,
		period: number,
		poolId: string,
	) => {
		return this.liquidityRepository
			.getAvailStakeLiquiditiesBy(address, period, poolId)
			.then(LiquidityModelMapper.fromDetailListResponse)
			.catch<Array<LiquidityDetailModel>>(error => {
				console.log(error);
				return [];
			});
	};

	public getAvailUnstakeLiquiditiesBy = (
		address: string,
		period: number,
		poolId: string,
	) => {
		return this.liquidityRepository
			.getAvailUnstakeLiquiditiesBy(address, period, poolId)
			.then(LiquidityModelMapper.fromDetailListResponse)
			.catch<Array<LiquidityDetailModel>>(error => {
				console.log(error);
				return [];
			});
	};
}
