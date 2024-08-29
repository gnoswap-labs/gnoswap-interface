import { FC, useCallback, useEffect, useRef, useState } from "react";

import IconClose from "@components/common/icons/IconCancel";

import {
  FailContent,
  PendingContent,
  SnackbarContent,
  SuccessContent,
  SnackbarType,
  UpdatingContent,
} from "./contents";

import { SnackbarWrapper } from "./snackbar.styles";
import { UpdatingDoneContent } from "./contents/UpdatingDoneContent";

interface SnackbarProps {
  id: number;
  type: SnackbarType;
  timeout: number;
  content?: SnackbarContent;
  closeable?: boolean;
  isClosing?: boolean;
  onClose?: (id: number) => void;
}

const Snackbar: FC<SnackbarProps> = ({
  id,
  type = "success",
  timeout,
  closeable = true,
  isClosing = false,
  content,
  onClose,
}) => {
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
      {closeable && (
        <div className="icon-close" onClick={handleClose}>
          <IconClose />
        </div>
      )}
    </SnackbarWrapper>
  );
};

export { Snackbar };
