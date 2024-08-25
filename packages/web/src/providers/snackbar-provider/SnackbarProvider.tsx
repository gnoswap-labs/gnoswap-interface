import { createContext, FC, useCallback, useMemo, useState } from "react";

import { Snackbar, SnackbarType, SnackbarContent } from "./snackbar";
import { SnackbarOptions } from "./type";

import { SnackbarList } from "./snackbar-provider.styles";

interface SnackbarContenxtProps {
  enqueue: (
    content: SnackbarContent | undefined,
    options: SnackbarOptions,
  ) => void;
  clear: () => void;
}

export const SnackbarContext = createContext<SnackbarContenxtProps>({
  enqueue: () => {
    console.error("Calling notice without notice context");
  },
  clear: () => {
    console.log("Close notice");
  },
});

const SnackbarProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<
    {
      type: SnackbarType;
      id: number;
      content?: SnackbarContent;
      timeout: number;
    }[]
  >([]);

  const enqueue = useCallback<SnackbarContenxtProps["enqueue"]>(
    (content, options) => {
      setSnackbars(prev => [
        ...prev,
        {
          type: options.type,
          id: options.id,
          content,
          timeout: options.timeout,
        },
      ]);
    },
    [setSnackbars],
  );

  const clear = useCallback<SnackbarContenxtProps["clear"]>(() => {
    setSnackbars([]);
  }, []);

  const handleClose = useCallback(
    (id: number) => {
      setSnackbars(prev => prev.filter(item => item.id !== id));
    },
    [setSnackbars],
  );

  const contextValue = useMemo(
    () => ({
      enqueue,
      clear,
    }),
    [enqueue, clear],
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {snackbars.length > 0 && (
        <SnackbarList>
          {snackbars.map(item_ => {
            return (
              <Snackbar
                key={item_.id}
                type={item_.type}
                id={item_.id}
                timeout={item_.timeout}
                onClose={handleClose}
                content={item_.content}
              />
            );
          })}
        </SnackbarList>
      )}
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
