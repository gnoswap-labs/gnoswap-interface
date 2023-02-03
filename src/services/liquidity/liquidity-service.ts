import { LiquidityDetailModel } from "@/models/liquidity/liquidity-detail-model";
import { LiquidityModelMapper } from "@/models/liquidity/mapper/liquildity-model-mapper";
import { LiquidityRepository } from "@/repositories/liquidity";

export class LiquidityService {
	private liquidityRepository: LiquidityRepository;

	constructor(liquidityRepository: LiquidityRepository) {
		this.liquidityRepository = liquidityRepository;
	}

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
}
