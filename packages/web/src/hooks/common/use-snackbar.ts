import { useContext } from "react";

import { SnackbarContext, SnackbarOptions } from "@providers/snackbar-provider";
import {
  SnackbarContent,
  SnackbarType,
} from "@providers/snackbar-provider/snackbar";

export const useSnackbar = () => {
  const { enqueue, clear } = useContext(SnackbarContext);

  return {
    enqueue,
    clear,
  };
};

export type { SnackbarOptions, SnackbarContent, SnackbarType };
