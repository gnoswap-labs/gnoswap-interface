import { createContext, FC, useCallback, useEffect, useMemo, useState } from "react";
import { useAtomValue, useStore } from "jotai";
import { WalletState } from "@states/index";

import { Snackbar, SnackbarContent, SnackbarType } from "./snackbar";
import { SnackbarOptions } from "./type";

import { SnackbarList } from "./snackbar-provider.styles";

interface SnackbarContenxtProps {
  hasBadgeSnackbar: boolean;
  hasStakePositionSnackbar: boolean;
  enqueue: (content: SnackbarContent | undefined, options: SnackbarOptions) => void;
  change: (id: number, type: SnackbarType) => void;
  dequeue: (id: number) => void;
  clear: () => void;
}

export const SnackbarContext = createContext<SnackbarContenxtProps>({
  hasBadgeSnackbar: false,
  hasStakePositionSnackbar: false,
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
  const accountAddress = useAtomValue(WalletState.account)?.address;
  const store = useStore();
  const [snackbars, setSnackbars] = useState<
    {
      id: number;
      type: SnackbarType;
      timeout: number;
      accountAddress?: string;
      content?: SnackbarContent;
      isClosing?: boolean;
      onClick?: () => void;
    }[]
  >([]);

  useEffect(() => {
    setSnackbars(prev =>
      prev.filter(
        item => item.type !== "receive-wugnot" || (!!accountAddress && item.accountAddress === accountAddress),
      ),
    );
  }, [accountAddress]);

  const visibleSnackbars = useMemo(
    () =>
      snackbars.filter(
        item => item.type !== "receive-wugnot" || (!!accountAddress && item.accountAddress === accountAddress),
      ),
    [snackbars, accountAddress],
  );

  const hasBadgeSnackbar = useMemo(() => {
    return visibleSnackbars.some(item => item.type === "receive-wugnot" && !item.isClosing && item.timeout === 0);
  }, [visibleSnackbars]);

  const hasStakePositionSnackbar = useMemo(() => {
    return snackbars.filter(item => item.type === "stake-position" && item.timeout === 0).length > 0;
  }, [snackbars]);

  const enqueue = useCallback<SnackbarContenxtProps["enqueue"]>(
    (content, options) => {
      setSnackbars(prev => {
        if (options.type === "receive-wugnot") {
          if (!options.accountAddress || options.accountAddress !== store.get(WalletState.account)?.address)
            return prev;
          const existingIndex = prev.findIndex(
            item => item.type === "receive-wugnot" && item.accountAddress === options.accountAddress && !item.isClosing,
          );
          if (existingIndex !== -1) {
            return prev.map((item, index) =>
              index === existingIndex ? { ...item, content, onClick: content?.onClick } : item,
            );
          }
        }
        const previousSnackbars =
          options.type === "stake-position"
            ? prev.map(item => (item.type === "stake-position" ? { ...item, isClosing: true } : item))
            : prev;

        return [
          ...previousSnackbars,
          {
            id: options.id,
            type: options.type,
            timeout: options.timeout,
            accountAddress: options.accountAddress,
            content,
            isClosing: false,
            onClick: content?.onClick,
          },
        ];
      });
    },
    [store],
  );

  const change = useCallback<SnackbarContenxtProps["change"]>(
    (id, type) => {
      setSnackbars(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                type,
                timeout: type === "updating-done" ? 3_000 : item.timeout,
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
      hasBadgeSnackbar,
      hasStakePositionSnackbar,
      enqueue,
      change,
      dequeue,
      clear,
    }),
    [hasBadgeSnackbar, hasStakePositionSnackbar, enqueue, change, dequeue, clear],
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {visibleSnackbars.length > 0 && (
        <SnackbarList>
          {visibleSnackbars.map(item_ => {
            return (
              <Snackbar
                key={item_.id}
                id={item_.id}
                type={item_.type}
                timeout={item_.timeout}
                content={item_.content}
                isClosing={item_.isClosing}
                onClick={item_.onClick}
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
