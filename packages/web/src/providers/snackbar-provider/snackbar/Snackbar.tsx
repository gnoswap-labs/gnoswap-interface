import { FC, useCallback, useEffect, useRef, useState } from "react";

import IconClose from "@components/common/icons/IconCancel";

import {
  FailContent,
  PendingContent,
  SnackbarContent,
  SnackbarType,
  SuccessContent,
  UpdatingContent,
} from "./contents";

import { ReceiveWugnotContent } from "./contents/ReceiveWugnotContent";
import { UpdatingDoneContent } from "./contents/UpdatingDoneContent";
import { SnackbarWrapper } from "./snackbar.styles";

interface SnackbarProps {
  id: number;
  type: SnackbarType;
  timeout: number;
  content?: SnackbarContent;
  closeable?: boolean;
  isClosing?: boolean;
  onClose?: (id: number) => void;
  onClick?: () => void;
}

const Snackbar: FC<SnackbarProps> = ({
  id,
  type = "success",
  timeout,
  closeable = true,
  isClosing = false,
  content,
  onClose,
  onClick = () => {
    return;
  },
}) => {
  const isClosed = useRef(false);
  const [typeAnimation, setTypeAnimation] = useState<"toast-item" | "closing" | "">("toast-item");

  const handleClose = useCallback(() => {
    setTypeAnimation("closing");
    const timeout = setTimeout(() => {
      onClose?.(id);
      setTypeAnimation("");
      isClosed.current = true;
    }, 500);
    return () => clearTimeout(timeout);
  }, [onClose]);

  const handleClick = useCallback(() => {
    handleClose();
    onClick?.();
  }, [handleClose, onClick]);

  useEffect(() => {
    if (timeout === 0) return;

    const autoCloseTimeout = setTimeout(() => {
      setTypeAnimation("closing");
      const animationTimeout = setTimeout(() => {
        if (isClosed.current === false) onClose?.(id);
      }, 500);
      return () => clearTimeout(animationTimeout);
    }, timeout);

    return () => {
      clearTimeout(autoCloseTimeout);
    };
  }, [onClose]);

  useEffect(() => {
    if (isClosing) {
      handleClose();
    }
  }, [handleClose, isClosing]);

  return (
    <SnackbarWrapper className={`${typeAnimation}`}>
      {type === "success" && <SuccessContent content={content} />}
      {type === "error" && <FailContent content={content} />}
      {type === "pending" && <PendingContent content={content} />}
      {type === "updating" && <UpdatingContent content={content} />}
      {type === "updating-done" && <UpdatingDoneContent content={content} />}
      {type === "receive-wugnot" && (
        <ReceiveWugnotContent content={content} onClick={handleClick} close={handleClose} />
      )}
      {closeable && (
        <div className="icon-close" onClick={handleClose}>
          <IconClose />
        </div>
      )}
    </SnackbarWrapper>
  );
};

export { Snackbar };
