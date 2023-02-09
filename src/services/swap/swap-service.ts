import { SwapConfirmMapper } from "@/models/swap/mapper/swap-confirm-mapper";
import { SwapConfirmModel } from "@/models/swap/swap-confirm-model";
import { SwapExpectedMapper } from "@/models/swap/mapper/swap-expected-mapper";
import { SwapRateModel } from "@/models/swap/swap-rate-model";
import { returnNullWithLog } from "@/common/utils/error-util";
import { SwapRepository } from "@/repositories/swap";
import { SwapInfoRequest } from "@/repositories/swap/request/swap-info-request";
import { SwapRequest } from "@/repositories/swap/request";
import { SwapRateMapper } from "@/models/swap/mapper/swap-rate-mapper";

export class SwapService {
	private swapRepository: SwapRepository;

	constructor(swapRepository: SwapRepository) {
		this.swapRepository = swapRepository;
	}

	public getSwapRate = async ({
		token0Symbol,
		token0Amount,
		token1Symbol,
		token1Amount,
		type,
	}: SwapRateModel) => {
		const request: SwapInfoRequest = SwapRateMapper.toRateRequest({
			token0Symbol,
			token0Amount,
			token1Symbol,
			token1Amount,
			type,
		});
		return await this.swapRepository
			.getSwapRate(request)
			.catch(returnNullWithLog);
	};

	public getExpectedSwapResult = async ({
		token0Symbol,
		token0Amount,
		token1Symbol,
		token1Amount,
		type,
	}: SwapRateModel) => {
		const request: SwapInfoRequest = SwapRateMapper.toRateRequest({
			token0Symbol,
			token0Amount,
			token1Symbol,
			token1Amount,
			type,
		});
		return await this.swapRepository
			.getExpectedSwapResult(request)
			.then(SwapExpectedMapper.fromExpectedResponse)
			.catch(returnNullWithLog);
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
			.catch(returnNullWithLog);
	};
}
