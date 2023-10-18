import { SwapRequest } from "./request";
import { FindBestPoolReqeust } from "./request/find-best-pool-request";
import { SwapInfoRequest } from "./request/swap-info-request";
import {
  SwapExpectedResultResponse,
  SwapFeeResponse,
  SwapRateResponse,
  SwapResponse,
} from "./response";
import { SwapPoolResponse } from "./response/swap-pool-response";

export interface SwapRepository {
  findSwapPool: (request: FindBestPoolReqeust) => Promise<SwapPoolResponse>;

  getSwapRate: (request: SwapInfoRequest) => Promise<SwapRateResponse>;

  getSwapFee: () => Promise<SwapFeeResponse>;

  getExpectedSwapResult: (
    request: SwapRequest,
  ) => Promise<SwapExpectedResultResponse>;

  getSlippage: () => number;

  setSlippage: (slippage: number) => boolean;

  swap: (request: SwapRequest) => Promise<SwapResponse | null>;
}
