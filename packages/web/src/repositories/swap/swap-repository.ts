import { SwapHistoryRequest } from "./request/swap-history-request";
import { SwapHistoryItem } from "./response/swap-history-response";

export interface SwapRepository {
  getSwapHistory: (request: SwapHistoryRequest) => Promise<SwapHistoryItem[]>;
}
