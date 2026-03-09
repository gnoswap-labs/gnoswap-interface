export type SnackbarType =
  | "success"
  | "error"
  | "pending"
  | "updating"
  | "updating-done"
  | "withdraw-success"
  | "withdraw-error"
  | "receive-wugnot";

export interface SnackbarContent {
  title?: string;
  description?: string;
  txHash?: string;
  onClick?: () => void;
}
