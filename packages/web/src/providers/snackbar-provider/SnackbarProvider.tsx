import {
  createContext,
  FC,
  useCallback,
  useEffect,
  useMemo, useState
} from "react";

import {
  Snackbar,
  SnackbarProps,
  SnackbarType,
  SnackbarContent,
} from "./snackbar";
import { SnackbarOptions } from "./type";

import { SnackbarList } from "./snackbar-provider.styles";

interface SnackbarContenxtProps {
  setNotice: (
    content: SnackbarContent | undefined,
    options: SnackbarOptions,
  ) => void;
  onCloseNotice: () => void;
}

export const SnackbarContext = createContext<SnackbarContenxtProps>({
  setNotice: () => {
    console.error("Calling notice without notice context");
  },
  onCloseNotice: () => {
    console.log("Close notice");
  },
});

const SnackbarProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentNotice, setCurrentNotice] = useState<
    (SnackbarProps & { timeout: number }) | null
  >(null);
  const [list, setList] = useState<
    { type: SnackbarType; id: number; content?: SnackbarContent }[]
  >([]);

  const setNotice = useCallback<SnackbarContenxtProps["setNotice"]>(
    (content, options) => {
      setCurrentNotice({
        ...options,
      });
      setList(prev => [
        ...prev,
        { type: options.type, id: options.id, content },
      ]);
    },
    [list],
  );

  const onCloseNotice = useCallback<SnackbarContenxtProps["onCloseNotice"]>(() => {
    setCurrentNotice(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      setNotice,
      onCloseNotice,
    }),
    [setNotice, onCloseNotice],
  );

  useEffect(() => {
    let timeoutId: number;

    if (currentNotice?.timeout) {
      timeoutId = window.setTimeout(() => {
        setCurrentNotice(null);
      }, currentNotice.timeout);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentNotice]);

  const handleClose = useCallback(
    (id: number) => {
      setList(prev => prev.filter(item => item.id !== id));
    },
    [setList],
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {list.length > 0 && (
        <SnackbarList>
          {list.map(item_ => {
            return (
              <Snackbar
                key={item_.id}
                type={item_.type}
                id={item_.id}
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
