export type SnackbarType =
  | "success"
  | "error"
  | "pending"
  | "updating"
  | "withdraw-success"
  | "withdraw-error";

export interface SnackbarContent {
  title?: string;
  description?: string;
  txHash?: string;
}
