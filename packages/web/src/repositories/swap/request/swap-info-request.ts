export interface SwapInfoRequest {
  token0Symbol: string;
  token0Amount: string;
  token1Symbol: string;
  token1Amount: string;
  type: "EXACT_IN" | "EXACT_OUT";
}
