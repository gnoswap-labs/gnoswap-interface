import { SwapHistoryRequest } from "./request/swap-history-request";
import { SwapHistoryResponse } from "./response/swap-history-response";

export interface SwapRepository {
  getSwapHistory: (request: SwapHistoryRequest) => Promise<SwapHistoryResponse[]>;
}
