export type SnackbarType =
  | "success"
  | "error"
  | "loading"
  | "pending"
  | "withdraw-success"
  | "withdraw-error";

export interface SnackbarContent {
  title?: string;
  description?: string;
  txHash?: string;
}
