import { EstimatedRoute } from "@models/swap/swap-route-info";
import { TokenModel } from "@models/token/token-model";

export interface DrySwapRequest {
  inputToken: TokenModel;

  outputToken: TokenModel;

  tokenAmount: number;

  exactType: "EXACT_IN" | "EXACT_OUT";

  estimatedRoutes: EstimatedRoute[];

  slippage: number;

  originAmount: number;

  tokenAmountLimit: number;
}

export interface SwapRouteRequest {
  inputToken: TokenModel;

  outputToken: TokenModel;

  tokenAmount: number;

  estimatedRoutes: EstimatedRoute[];

  slippage: number;

  originAmount: number;

  tokenAmountLimit: number;

  deadline: number;

  referrerAddress: string | null;

  gasPrice: number;
}
