import { generateNumber, generateTxHash } from "@/common/utils/test-util";
import {
	SwapExpectedResultResponse,
	SwapFeeReponse,
	SwapRateResponse,
	SwapRepository,
	SwapResponse,
} from ".";
import { SwapRequest } from "./request";

export class MockSwapRepository implements SwapRepository {
	public getSwapRate = async (
		token0Symbol: string,
		token1Symbol: string,
	): Promise<SwapRateResponse> => {
		return {
			rate: generateNumber(0, 100),
		};
	};

	public getSwapFee = async (): Promise<SwapFeeReponse> => {
		return {
			fee: generateNumber(0, 1),
		};
	};

	public getExpectedSwapResult = async (
		token0Symbol: string,
		token0Amount: string,
		token1Symbol: string,
		token1Amount: string,
	): Promise<SwapExpectedResultResponse> => {
		return {
			price_impact: generateNumber(0, 10000),
			min_received: generateNumber(0, 10000),
			gas_fee: generateNumber(0, 1),
		};
	};

	public setSlippage = async (slippage: number): Promise<void> => {};

	public swap = async (request: SwapRequest): Promise<SwapResponse> => {
		return {
			tx_hash: generateTxHash(),
		};
	};
}
