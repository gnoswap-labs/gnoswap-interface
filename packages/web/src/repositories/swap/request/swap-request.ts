export interface SwapRequest {
  tokenA: {
    path: string;
    amount: number;
  };
  tokenB: {
    path: string;
    amount: number;
  };
  type: "EXACT_IN" | "EXACT_OUT";
  slippage: number;
  gasFee: number;
}
