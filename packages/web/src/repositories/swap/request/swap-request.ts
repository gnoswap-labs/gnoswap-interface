export interface SwapRequest {
  token0: {
    tokenId: string;
    amount: number;
  };
  token1: {
    tokenId: string;
    amount: number;
  };
  type: "EXACT_IN" | "EXACT_OUT";
  slippage: number;
  gasFee: number;
}
