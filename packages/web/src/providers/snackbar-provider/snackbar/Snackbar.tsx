import { FC, useCallback, useEffect, useRef, useState } from "react";

import IconClose from "@components/common/icons/IconCancel";

import {
  FailContent,
  PendingContent,
  SnackbarContent,
  SuccessContent,
  SnackbarType,
} from "./contents";

import { SnackbarWrapper } from "./snackbar.styles";

interface SnackbarProps {
  closeable?: boolean;
  onClose?: (id: number) => void;
  type: SnackbarType;
  id: number;
  content?: SnackbarContent;
  timeout: number;
}

const Snackbar: FC<SnackbarProps> = ({
  closeable = true,
  onClose,
  type = "success",
  id,
  content,
  timeout,
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

  return (
    <SnackbarWrapper className={`${typeAnimation}`}>
      {type === "success" && <SuccessContent content={content} />}
      {type === "error" && <FailContent content={content} />}
      {type === "pending" && <PendingContent content={content} />}
      {closeable && (
        <div className="icon-close" onClick={handleClose}>
          <IconClose />
        </div>
      )}
    </SnackbarWrapper>
  );
};

export { Snackbar };
