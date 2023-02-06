import { returnNullWithLog } from "@/common/utils/error-util";
import { TransactionHashModelMapper } from "@/models/common/mapper/transaction-hash-model-mapper";
import { LiquidityRewardModelMapper } from "@/models/liquidity/mapper/liquildity-reward-model-mapper";
import { LiquidityRepository } from "@/repositories/liquidity";

export class LiquidityRewardService {
	private liquidityRepository: LiquidityRepository;

	constructor(liquidityRepository: LiquidityRepository) {
		this.liquidityRepository = liquidityRepository;
	}

	public getLiquidityReward = (address: string, poolId: string) => {
		return this.liquidityRepository
			.getLiquidityRewardByAddressAndPoolId(address, poolId)
			.then(LiquidityRewardModelMapper.fromResponse)
			.catch(returnNullWithLog);
	};

	public claimReward = (poolId: string) => {
		return this.liquidityRepository
			.claimRewardByPoolId(poolId)
			.then(TransactionHashModelMapper.fromResponse)
			.catch(returnNullWithLog);
	};
}
