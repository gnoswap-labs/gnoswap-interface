import {
	AddLiquidityRequest,
	ClaimRewardReqeust,
	RemoveLiquidityRequest,
} from "./request";
import {
	AddLiquidityResponse,
	ClaimRewardResponse,
	LiquidityDetailInfoResponse,
	LiquidityListResponse,
	LiquidityRewardResponse,
	RemoveLiquidityResponse,
} from "./response";

export interface LiquidityRepository {
	getLiquidityDetailById: (
		liquidityId: string,
	) => Promise<LiquidityDetailInfoResponse>;

	getLiquiditiesByAddress: (address: string) => Promise<LiquidityListResponse>;

	addLiquidity: (request: AddLiquidityRequest) => Promise<AddLiquidityResponse>;

	removeLiquidities: (
		request: RemoveLiquidityRequest,
	) => Promise<RemoveLiquidityResponse>;

	getLiquidityRewardBy: (
		poolId: string,
		address: string,
	) => Promise<LiquidityRewardResponse>;

	claimReward: (request: ClaimRewardReqeust) => Promise<ClaimRewardResponse>;
}
