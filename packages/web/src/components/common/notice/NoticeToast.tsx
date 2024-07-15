import {
  INoticeContext,
  NoticeContext,
  TNoticeType
} from "@context/NoticeContext";
import { useGnoscanUrl, GnoscanDataType } from "@hooks/common/use-gnoscan-url";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import IconClose from "../icons/IconCancel";
import IconFailed from "../icons/IconFailed";
import IconNewTab from "../icons/IconNewTab";
import IconSuccess from "../icons/IconSuccess";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { NoticeUIList, NoticeUIWrapper } from "./NoticeToast.styles";

export interface INoticeContent {
  title?: string;
  description?: string;
  txHash?: string;
}

interface NoticeProps {
  closeable?: boolean;
  onClose?: (id: number) => void;
  type: TNoticeType;
  id: number;
  content?: INoticeContent;
}

const SuccessContent: FC<{ content?: INoticeContent }> = ({ content }) => {
  const { getGnoscanUrl, getTxUrl } = useGnoscanUrl();

  return content ? (
    <div className="notice-body">
      <IconSuccess className="icon-success" />
      <div>
        <h5>{content.title} - Success!</h5>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: content.description || "" }}
        />
        {content.txHash ? (
          <a href={getTxUrl(content.txHash)} target="_blank">
            View transaction <IconNewTab />
          </a>
        ) : null}
      </div>
    </div>
  ) : (
    <div className="notice-body">
      <IconSuccess className="icon-success" />
      <div>
        <h5>Success!</h5>
        <p>Your job was finished successfully</p>
        <a href={getGnoscanUrl(GnoscanDataType.Transactions)} target="_blank">
          View transaction <IconNewTab />
        </a>
      </div>
    </div>
  );
};

const PendingContent: FC<{ content?: INoticeContent }> = ({ content }: { content?: INoticeContent }) => {
  const { getGnoscanUrl, getTxUrl } = useGnoscanUrl();

  return content ? (
    <div className="notice-body">
      <LoadingSpinner className="loading-icon" />
      <div>
        <h5>{content.title ? content.title : "Broadcasting Transaction"}</h5>
        <p className="waiting-confirmation">
          Waiting for Transaction Confirmation
        </p>
        {content.txHash ? (
          <a href={getTxUrl(content.txHash)} target="_blank">
            View transaction <IconNewTab />
          </a>
        ) : null}
      </div>
    </div>
  ) : (
    <div className="notice-body">
      <LoadingSpinner className="loading-icon" />
      <div>
        <h5>Broadcasting Transaction</h5>
        <p className="waiting-confirmation">
          Waiting for Transaction Confirmation
        </p>
        <a href={getGnoscanUrl(GnoscanDataType.Transactions)} target="_blank">
          View transaction <IconNewTab />
        </a>
      </div>
    </div>
  );
};

const FailContent: FC<{ content?: INoticeContent }> = ({ content }: { content?: INoticeContent }) => {
  const { getGnoscanUrl, getTxUrl } = useGnoscanUrl();

  return content ? (
    <div className="notice-body">
      <IconFailed className="icon-success" />
      <div>
        <h5>{content.title} - Failure!</h5>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: content.description || "" }}
        />
        {content.txHash ? (
          <a href={getTxUrl(content.txHash)} target="_blank">
            View transaction <IconNewTab />
          </a>
        ) : null}
      </div>
    </div>
  ) : (
    <div className="notice-body">
      <IconFailed className="icon-success" />
      <div>
        <h5>Failure!</h5>
        <p>This notice occur by some problem.</p>
        <a href={getGnoscanUrl(GnoscanDataType.Transactions)} target="_blank">
          View transaction <IconNewTab />
        </a>
      </div>
    </div>
  );
};

const NoticeUIItem: FC<NoticeProps> = ({ onClose, type = "success", id, content }) => {
  const isClosed = useRef(false);
  const [typeAnimation, setTypeAnimation] = useState<
    "toast-item" | "closing" | ""
  >("toast-item");

  const handleClose = useCallback(() => {
    setTypeAnimation("closing");
    const timeout = setTimeout(() => {
      onClose?.(id);
      setTypeAnimation("");
      isClosed.current = true;
    }, 500);
    return () => clearTimeout(timeout);
  }, [onClose]);

  useEffect(() => {
    const autoCloseTimeout = setTimeout(() => {
      setTypeAnimation("closing");
      const animationTimeout = setTimeout(() => {
        if (isClosed.current === false) onClose?.(id);
      }, 500);
      return () => clearTimeout(animationTimeout);
    }, 6000);

    return () => {
      clearTimeout(autoCloseTimeout);
    };
  }, [onClose]);

  return (
    <NoticeUIWrapper className={`${typeAnimation}`}>
      {type === "success" && <SuccessContent content={content} />}
      {type === "error" && <FailContent content={content} />}
      {type === "pending" && <PendingContent content={content} />}
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
  const [list, setList] = useState<{ type: TNoticeType; id: number; content?: INoticeContent; }[]>([]);

  const setNotice = useCallback<INoticeContext["setNotice"]>(
    (content, options) => {
      setCurrentNotice({
        ...options,
      });
      setList(prev => [...prev, { type: options.type, id: options.id, content }]);
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
                content={item_.content}
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
