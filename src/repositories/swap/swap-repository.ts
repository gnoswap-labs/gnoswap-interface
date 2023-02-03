import { SwapRequest } from "./request";
import {
	SwapExpectedResultResponse,
	SwapFeeReponse,
	SwapRateResponse,
	SwapResponse,
} from "./response";

export interface SwapRepository {
	getSwapRate: (
		token0Symbol: string,
		token1Symbol: string,
	) => Promise<SwapRateResponse>;

	getSwapFee: () => Promise<SwapFeeReponse>;

	getExpectedSwapResult: (
		token0Symbol: string,
		token0Amount: string,
		token1Symbol: string,
		token1Amount: string,
	) => Promise<SwapExpectedResultResponse>;

	setSlippage: (slippage: number) => Promise<void>;

	swap: (request: SwapRequest) => Promise<SwapResponse>;
}
