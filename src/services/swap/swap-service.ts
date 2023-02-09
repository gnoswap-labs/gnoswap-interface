import { SwapMapper } from "../../models/swap/mapper/swap-mapper";
import {
	SwapRateRequestModel,
	SwapRateResponseModel,
} from "./../../models/swap/swap-rate-model";
import { ExactTypeOption } from "./../../common/values/data-constant";
import { returnNullWithLog } from "@/common/utils/error-util";
import { SwapRepository } from "@/repositories/swap";
import BigNumber from "bignumber.js";
import { notEmptyStringType } from "@/common/utils/data-check-util";

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
	}: SwapRateRequestModel) => {
		const request: SwapRateResponseModel = SwapMapper.toRateRequest({
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
	}: SwapRateRequestModel) => {
		const request: SwapRateResponseModel = SwapMapper.toRateRequest({
			token0Symbol,
			token0Amount,
			token1Symbol,
			token1Amount,
			type,
		});
		return await this.swapRepository.getExpectedSwapResult(request);
	};

	public setSlippage = (slippage: number) => {
		return this.swapRepository.setSlippage(slippage);
	};

	public getSlippage = () => {
		return this.swapRepository.getSlippage();
	};

	public confirmSwap = async () => {};
}
