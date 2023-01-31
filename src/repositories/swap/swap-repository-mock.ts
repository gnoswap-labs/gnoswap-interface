import {
	SwapExpectedResultResponse,
	SwapFeeReponse,
	SwapRateResponse,
	SwapRepository,
	SwapResposne,
} from ".";
import { SwapRequest } from "./request";

export class SwapRepositoryMock implements SwapRepository {
	public getSwapRate = async (
		token0Symbol: string,
		token1Symbol: string,
	): Promise<SwapRateResponse> => {
		return {};
	};

	public getSwapFee = async (): Promise<SwapFeeReponse> => {
		return {};
	};

	public getExpectedSwapResult = async (
		token0Symbol: string,
		token0Amount: string,
		token1Symbol: string,
		token1Amount: string,
	): Promise<SwapExpectedResultResponse> => {
		return {};
	};

	public setSlippage = async (slippage: number): Promise<void> => {};

	public swap = async (request: SwapRequest): Promise<SwapResposne> => {
		return {};
	};
}
