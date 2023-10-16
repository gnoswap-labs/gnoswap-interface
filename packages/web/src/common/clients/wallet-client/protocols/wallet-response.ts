export interface WalletResponse<T = {}> {
  code: number;
  status: string;
  type: string;
  message: string;
  data: T | null;
}
