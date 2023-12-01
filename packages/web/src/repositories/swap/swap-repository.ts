import { SwapRequest } from "./request";
import { SwapInfoRequest } from "./request/swap-info-request";
import {
  SwapExpectedResultResponse,
  SwapFeeResponse,
  SwapRateResponse,
  SwapResponse,
} from "./response";

export interface SwapRepository {
  getSwapRate: (request: SwapInfoRequest) => Promise<SwapRateResponse>;

  getSwapFee: () => Promise<SwapFeeResponse>;

  getExpectedSwapResult: (
    request: SwapRequest,
  ) => Promise<SwapExpectedResultResponse>;

  getSlippage: () => number;

  setSlippage: (slippage: number) => boolean;

  swap: (request: SwapRequest) => Promise<SwapResponse | null>;
}
