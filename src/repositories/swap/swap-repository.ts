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
		token0Amount: string,
		token1Symbol: string,
		token1Amount: string,
		type: "EXACT_IN" | "EXANCT_OUT",
	) => Promise<SwapRateResponse>;

	getSwapFee: () => Promise<SwapFeeReponse>;

	getExpectedSwapResult: (
		token0Symbol: string,
		token0Amount: string,
		token1Symbol: string,
		token1Amount: string,
		type: "EXACT_IN" | "EXANCT_OUT",
	) => Promise<SwapExpectedResultResponse>;

	getSlippage: () => number;

	setSlippage: (slippage: number) => boolean;

	swap: (request: SwapRequest) => Promise<SwapResponse>;
}
