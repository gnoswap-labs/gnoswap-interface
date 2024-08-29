export type SnackbarType =
  | "success"
  | "error"
  | "pending"
  | "updating"
  | "updating-done"
  | "withdraw-success"
  | "withdraw-error";

export interface SnackbarContent {
  title?: string;
  description?: string;
  txHash?: string;
}
