import { returnErrorResponse } from "./../../common/utils/error-util";
import { SwapConfirmMapper } from "@/models/swap/mapper/swap-confirm-mapper";
import { SwapConfirmModel } from "@/models/swap/swap-confirm-model";
import { SwapExpectedMapper } from "@/models/swap/mapper/swap-expected-mapper";
import { SwapRepository } from "@/repositories/swap";
import { SwapInfoRequest } from "@/repositories/swap/request/swap-info-request";
import { SwapRequest } from "@/repositories/swap/request";
import { SwapRateMapper } from "@/models/swap/mapper/swap-rate-mapper";
import { TokenDefaultModel } from "@/models/token/token-default-model";
import { ExactTypeOption } from "@/common/values/data-constant";
import BigNumber from "bignumber.js";
import { SwapError } from "@/common/errors/swap";
import { TokenPairModel } from "@/models/token/token-pair-model";

export class SwapService {
	private swapRepository: SwapRepository;

	constructor(swapRepository: SwapRepository) {
		this.swapRepository = swapRepository;
	}

	public getSwapRate = async (
		token0: TokenDefaultModel,
		token1: TokenDefaultModel,
		type: ExactTypeOption,
	) => {
		const request: SwapInfoRequest = SwapRateMapper.toRateRequest({
			token0,
			token1,
			type,
		});
		return await this.swapRepository
			.getSwapRate(request)
			.then(res => BigNumber(res.rate))
			.catch(() =>
				returnErrorResponse(new SwapError("SWAP_RATE_LOOKUP_FAILED")),
			);
	};

	public getExpectedSwapResult = async (
		token0: TokenDefaultModel,
		token1: TokenDefaultModel,
		type: ExactTypeOption,
	) => {
		const request: SwapInfoRequest = SwapRateMapper.toRateRequest({
			token0,
			token1,
			type,
		});
		return await this.swapRepository
			.getExpectedSwapResult(request)
			.then(SwapExpectedMapper.fromExpectedResponse)
			.catch(() =>
				returnErrorResponse(new SwapError("EXPECTED_RESULT_LOOKUP_FAILED")),
			);
	};

	public setSlippage = (slippage: number) => {
		return this.swapRepository.setSlippage(slippage);
	};

	public getSlippage = () => {
		return this.swapRepository.getSlippage();
	};

	public confirmSwap = async (model: SwapConfirmModel) => {
		const request: SwapRequest = SwapConfirmMapper.toConfirmRequest(model);
		return await this.swapRepository
			.swap(request)
			.then(SwapConfirmMapper.fromConfirmResponse)
			.catch(() => returnErrorResponse(new SwapError("SWAP_FAILED")));
	};
}
