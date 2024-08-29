import { createContext, FC, useCallback, useMemo, useState } from "react";

import { Snackbar, SnackbarType, SnackbarContent } from "./snackbar";
import { SnackbarOptions } from "./type";

import { SnackbarList } from "./snackbar-provider.styles";

interface SnackbarContenxtProps {
  enqueue: (
    content: SnackbarContent | undefined,
    options: SnackbarOptions,
  ) => void;
  change: (id: number, type: SnackbarType) => void;
  dequeue: (id: number) => void;
  clear: () => void;
}

export const SnackbarContext = createContext<SnackbarContenxtProps>({
  enqueue: () => {
    console.error("Calling notice without notice context");
  },
  change: () => {
    console.error("Close notice");
  },
  dequeue: () => {
    console.error("Close notice");
  },
  clear: () => {
    console.log("Close notice");
  },
});

const SnackbarProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<
    {
      id: number;
      type: SnackbarType;
      timeout: number;
      content?: SnackbarContent;
      isClosing?: boolean;
    }[]
  >([]);

  const enqueue = useCallback<SnackbarContenxtProps["enqueue"]>(
    (content, options) => {
      setSnackbars(prev => [
        ...prev,
        {
          id: options.id,
          type: options.type,
          timeout: options.timeout,
          content,
          isClosing: false,
        },
      ]);
    },
    [setSnackbars],
  );

  const change = useCallback<SnackbarContenxtProps["change"]>(
    (id, type) => {
      setSnackbars(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                type,
              }
            : item,
        ),
      );
    },
    [setSnackbars],
  );

  const dequeue = useCallback<SnackbarContenxtProps["dequeue"]>(
    id => {
      setSnackbars(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                isClosing: true,
              }
            : item,
        ),
      );
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
      change,
      dequeue,
      clear,
    }),
    [enqueue, change, dequeue, clear],
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {snackbars.length > 0 && (
        <SnackbarList>
          {snackbars.map(item_ => {
            return (
              <Snackbar
                key={item_.id}
                id={item_.id}
                type={item_.type}
                timeout={item_.timeout}
                content={item_.content}
                isClosing={item_.isClosing}
                onClose={handleClose}
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
