import { SwapRequest } from "./request";
import { SwapInfoRequest } from "./request/swap-info-request";
import {
	SwapExpectedResultResponse,
	SwapFeeReponse,
	SwapRateResponse,
	SwapResponse,
} from "./response";

export interface SwapRepository {
	getSwapRate: (request: SwapInfoRequest) => Promise<SwapRateResponse>;

	getSwapFee: () => Promise<SwapFeeReponse>;

	getExpectedSwapResult: (
		request: SwapInfoRequest,
	) => Promise<SwapExpectedResultResponse>;

	getSlippage: () => number;

	setSlippage: (slippage: number) => boolean;

	swap: (request: SwapRequest) => Promise<SwapResponse>;
}
