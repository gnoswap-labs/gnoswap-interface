export interface SwapHistoryRequest {
  tokenAPath: string;

  tokenBPath: string;

  cursor?: string;

  limit?: number;
}
