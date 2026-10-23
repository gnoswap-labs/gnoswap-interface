import { SnackbarContent, SnackbarType } from "./snackbar";

export interface SnackbarOptions {
  type: SnackbarType;
  id: number;
  timeout: number;
  accountAddress?: string;
  closeable?: boolean;
  onClose?: () => void;
  data?: SnackbarContent;
}
