import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  INoticeContext,
  NoticeContext,
  TNoticeType,
} from "src/context/NoticeContext";
import IconClose from "../icons/IconCancel";
import IconFailed from "../icons/IconFailed";
import IconNewTab from "../icons/IconNewTab";
import IconSuccess from "../icons/IconSuccess";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { NoticeUIList, NoticeUIWrapper } from "./NoticeToast.styles";

interface NoticeProps {
  closeable?: boolean;
  onClose?: (id: number) => void;
  type: TNoticeType;
  id: number;
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

const PendingContent: FC = () => {
  return (
    <div className="notice-body">
      <LoadingSpinner className="loading-icon" />
      <div>
        <h5>Broadcasting Transaction</h5>
        <p>Waiting for Transaction Confirmation</p>
        <a href={TEMP_URL} target="_blank">
          View transaction <IconNewTab />
        </a>
      </div>
    </div>
  );
};

const FailContent: FC = () => {
  return (
    <div className="notice-body">
      <IconFailed className="icon-success" />
      <div>
        <h5>Swap - Failure!</h5>
        <p>Failed swapping 0.1 GNOT for 0.12 GNS</p>
        <a href={TEMP_URL} target="_blank">
          View transaction <IconNewTab />
        </a>
      </div>
    </div>
  );
};

const NoticeUIItem: FC<NoticeProps> = ({ onClose, type = "success", id }) => {
  const [typeAnimation, setTypeAnimation] = useState<
    "toast-item" | "closing" | ""
  >("toast-item");

  const handleClose = useCallback(() => {
    setTypeAnimation("closing");
    const timeout = setTimeout(() => {
      onClose?.(id);
      setTypeAnimation("");
    }, 500);
    return () => clearTimeout(timeout);
  }, [onClose]);

  useEffect(() => {
    const autoCloseTimeout = setTimeout(() => {
      setTypeAnimation("closing");
      const animationTimeout = setTimeout(() => {
        onClose?.(id);
      }, 500);
      return () => clearTimeout(animationTimeout);
    }, 6000);

    return () => {
      clearTimeout(autoCloseTimeout);
    };
  }, [onClose]);

  return (
    <NoticeUIWrapper className={`${typeAnimation}`}>
      {type === "success" && <SuccessContent />}
      {type === "error" && <FailContent />}
      {type === "pending" && <PendingContent />}
      <div className="icon-close" onClick={handleClose}>
        <IconClose />
      </div>
    </NoticeUIWrapper>
  );
};

const Notice: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentNotice, setCurrentNotice] = useState<
    (NoticeProps & { timeout: number }) | null
  >(null);
  const [list, setList] = useState<{ type: TNoticeType; id: number }[]>([]);

  const setNotice = useCallback<INoticeContext["setNotice"]>(
    (_, options) => {
      setCurrentNotice({
        ...options,
      });
      setList(prev => [...prev, { type: options.type, id: options.id }]);
    },
    [list],
  );

  const onCloseNotice = useCallback<INoticeContext["onCloseNotice"]>(() => {
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
      console.log(id);

      setList(prev => prev.filter(item => item.id !== id));
    },
    [setList],
  );

  return (
    <NoticeContext.Provider value={contextValue}>
      {list.length > 0 && (
        <NoticeUIList>
          {list.map(item_ => {
            return (
              <NoticeUIItem
                key={item_.id}
                type={item_.type}
                id={item_.id}
                onClose={handleClose}
              />
            );
          })}
        </NoticeUIList>
      )}
      {children}
    </NoticeContext.Provider>
  );
};

export default Notice;
