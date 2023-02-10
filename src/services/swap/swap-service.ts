import { SwapConfirmMapper } from "@/models/swap/mapper/swap-confirm-mapper";
import { SwapConfirmModel } from "@/models/swap/swap-confirm-model";
import { SwapExpectedMapper } from "@/models/swap/mapper/swap-expected-mapper";
import { SwapRateModel } from "@/models/swap/swap-rate-model";
import { returnNullWithLog } from "@/common/utils/error-util";
import { SwapRepository } from "@/repositories/swap";
import { SwapInfoRequest } from "@/repositories/swap/request/swap-info-request";
import { SwapRequest } from "@/repositories/swap/request";
import { SwapRateMapper } from "@/models/swap/mapper/swap-rate-mapper";
import { TokenDefaultModel } from "@/models/token/token-default-model";
import { ExactTypeOption } from "@/common/values/data-constant";
import BigNumber from "bignumber.js";

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
		const { rate } = await this.swapRepository.getSwapRate({
			token0Amount: BigNumber(token0.amount?.value ?? 0).toString(),
			token0Symbol: token0.symbol,
			token1Amount: BigNumber(token1.amount?.value ?? 0).toString(),
			token1Symbol: token1.symbol,
			type,
		});

		if (type === "EXACT_IN") {
			const expectedToken1Amount = BigNumber(
				token0.amount?.value ?? 0,
			).multipliedBy(rate);
		}

		if (type === "EXACT_OUT") {
			const expectedToken0Amount = BigNumber(
				token1.amount?.value ?? 0,
			).multipliedBy(rate);
		}

		return;
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
