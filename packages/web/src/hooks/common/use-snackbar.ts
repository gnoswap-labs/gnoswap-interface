import { useContext } from "react";

import { SnackbarContext, SnackbarOptions } from "@providers/snackbar-provider";
import {
  SnackbarContent,
  SnackbarType,
} from "@providers/snackbar-provider/snackbar";

export const useSnackbar = () => {
  const { setNotice, onCloseNotice } = useContext(SnackbarContext);

  return {
    setNotice,
    onCloseNotice,
  };
};

export type { SnackbarOptions, SnackbarContent, SnackbarType };
