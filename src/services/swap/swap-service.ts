import { SwapRepository } from "@/repositories/swap";

export class SwapService {
	private swapRepository: SwapRepository;

	constructor(swapRepository: SwapRepository) {
		this.swapRepository = swapRepository;
	}

	public getSwapRate = async (token0Symbol: string, token1Symbol: string) => {};

	public getExpectedSwapResult = async () => {};

	public setSlippage = async (slippage: number) => {};

	public getSlippage = async () => {};

	public confirmSwap = async () => {};
}
