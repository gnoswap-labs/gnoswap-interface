import { useContext } from "react";

import { SnackbarContext, SnackbarOptions } from "@providers/snackbar-provider";
import {
  SnackbarContent,
  SnackbarType,
} from "@providers/snackbar-provider/snackbar";

export const useSnackbar = () => {
  const { enqueue, dequeue, change, clear } = useContext(SnackbarContext);

  return {
    enqueue,
    change,
    dequeue,
    clear,
  };
};

export type { SnackbarOptions, SnackbarContent, SnackbarType };
