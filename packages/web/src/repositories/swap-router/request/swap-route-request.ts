import { EstimatedRoute } from "@models/swap/swap-route-info";
import { TokenModel } from "@models/token/token-model";

export interface SwapRouteRequest {
  inputToken: TokenModel;

  outputToken: TokenModel;

  tokenAmount: string;

  estimatedRoutes: EstimatedRoute[];

  slippage: number;

  tokenAmountLimit: string;

  deadline: number;

  referrerAddress: string | null;

  gasFee?: string;

  gasUsed?: string;
}

/** A swap route request without the gas figures, which only the send path needs. */
export type SwapRouteMessagesRequest = Omit<SwapRouteRequest, "gasFee" | "gasUsed">;
