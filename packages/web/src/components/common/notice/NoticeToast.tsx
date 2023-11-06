import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  INoticeContext,
  NoticeContext,
  TNoticeType,
} from "src/context/NoticeContext";
import IconClose from "../icons/IconCancel";
import IconNewTab from "../icons/IconNewTab";
import IconSuccess from "../icons/IconSuccess";
import { NoticeContextWrapper, NoticeUIWrapper } from "./NoticeToast.styles";

interface NoticeProps {
  closeable?: boolean;
  onClose?: () => void;
  type?: TNoticeType;
  children?: React.ReactNode;
}

const TEMP_URL =
  "https://gnoscan.io/transactions/details?txhash=nYtu28RzUIovNjldGq+e8m8S1mVZHsGFYAHyawaWn54=";

const SuccessContent: FC = () => {
  return (
    <div className="notice-body">
      <IconSuccess className="icon-success" />
      <div>
        <h5>Swap - Success!</h5>
        <p>Swapped 1541.5 GNOT for 1090.55 GNS</p>
        <a href={TEMP_URL} target="_blank">
          View transaction <IconNewTab />
        </a>
      </div>
    </div>
  );
};

const NoticeUI: FC<NoticeProps> = ({
  children,
  closeable = true,
  onClose,
  type = "success",
}) => {
  return (
    <NoticeUIWrapper>
      {type === "success" && <SuccessContent />}
      {children}
      {closeable && (
        <div className="icon-close" onClick={onClose}>
          <IconClose />
        </div>
      )}
    </NoticeUIWrapper>
  );
};

const Notice: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentNotice, setCurrentNotice] = useState<
    (NoticeProps & { timeout?: number }) | null
  >(null);

  const setNotice = useCallback<INoticeContext["setNotice"]>(
    (content, options) => {
      setCurrentNotice({
        children: content,
        ...options,
      });
    },
    []
  );

  const onCloseNotice = useCallback<INoticeContext["onCloseNotice"]>(() => {
    setCurrentNotice(null);
    currentNotice?.onClose?.();
  }, []);

  const contextValue = useMemo(
    () => ({
      setNotice,
      onCloseNotice,
    }),
    [setNotice, onCloseNotice]
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

  return (
    <NoticeContext.Provider value={contextValue}>
      {currentNotice && (
        <NoticeContextWrapper>
          <NoticeUI
            {...currentNotice}
            onClose={() => {
              setCurrentNotice(null);
              currentNotice.onClose?.();
            }}
          >
            {currentNotice.children}
          </NoticeUI>
        </NoticeContextWrapper>
      )}
      {children}
    </NoticeContext.Provider>
  );
};

export default Notice;
