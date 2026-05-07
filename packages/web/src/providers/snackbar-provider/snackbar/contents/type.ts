export type SnackbarType =
  | "success"
  | "error"
  | "pending"
  | "updating"
  | "updating-done"
  | "withdraw-success"
  | "withdraw-error"
  | "receive-wugnot"
  | "stake-position";

export interface SnackbarContent {
  title?: string;
  description?: string;
  txHash?: string;
  logoUrl?: string;
  onClick?: () => void;
}
