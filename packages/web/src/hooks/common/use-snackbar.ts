import { useContext } from "react";

import { SnackbarContext, SnackbarOptions } from "@providers/snackbar-provider";
import {
  SnackbarContent,
  SnackbarType,
} from "@providers/snackbar-provider/snackbar";

export const useSnackbar = () => {
  const { enqueue, dequeue, clear } = useContext(SnackbarContext);

  return {
    enqueue,
    dequeue,
    clear,
  };
};

export type { SnackbarOptions, SnackbarContent, SnackbarType };
