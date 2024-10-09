export interface WalletResponse<T = { hash?: string }> {
  code: number;
  status: string;
  type: string;
  message: string;
  data: T | null;
}
