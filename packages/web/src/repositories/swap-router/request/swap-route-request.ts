import { EstimatedRoute } from "@models/swap/swap-route-info";
import { TokenModel } from "@models/token/token-model";

export interface DrySwapRequest {
  inputToken: TokenModel;

  outputToken: TokenModel;

  tokenAmount: number | string;

  exactType: "EXACT_IN" | "EXACT_OUT";

  estimatedRoutes: EstimatedRoute[];

  slippage: number;

  originAmount: number;

  tokenAmountLimit: number | string;
}

export interface SwapRouteRequest {
  inputToken: TokenModel;

  outputToken: TokenModel;

  tokenAmount: number | string;

  estimatedRoutes: EstimatedRoute[];

  slippage: number;

  originAmount: number;

  tokenAmountLimit: number | string;

  deadline: number;

  referrerAddress: string | null;

  gasFee?: string;

  gasUsed?: string;
}
