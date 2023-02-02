import {
	AddLiquidityRequest,
	ClaimRewardReqeust,
	RemoveLiquidityRequest,
} from "./request";
import {
	AddLiquidityResponse,
	ClaimRewardResponse,
	LiquidityDetailInfoResponse,
	LiquidityDetailListResponse,
	LiquidityRewardResponse,
	RemoveLiquidityResponse,
} from "./response";

export interface LiquidityRepository {
	getLiquidityDetailById: (
		liquidityId: string,
	) => Promise<LiquidityDetailInfoResponse>;

	getLiquiditiesByAddress: (
		address: string,
	) => Promise<LiquidityDetailListResponse>;

	addLiquidity: (request: AddLiquidityRequest) => Promise<AddLiquidityResponse>;

	removeLiquidities: (
		request: RemoveLiquidityRequest,
	) => Promise<RemoveLiquidityResponse>;

	getLiquidityRewardBy: (
		address: string,
		poolId: string,
	) => Promise<LiquidityRewardResponse>;

	claimReward: (request: ClaimRewardReqeust) => Promise<ClaimRewardResponse>;
}
