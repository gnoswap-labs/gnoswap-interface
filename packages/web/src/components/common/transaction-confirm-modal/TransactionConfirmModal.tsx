import React, { useCallback } from "react";
import { TransactionConfirmModalWrapper } from "./TransactionConfirmModal.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconSuccess from "@components/common/icons/IconSuccess";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconFailed from "@components/common/icons/IconFailed";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { TransactionConfirmStatus } from "@states/common";
import IconClose from "../icons/IconCancel";


interface TransactionConfirmModalProps {
  status: TransactionConfirmStatus;
  description: string | null;
  scannerURL: string | null;
  confirm: () => void;
  close: () => void;
}

const TransactionConfirmModal: React.FC<TransactionConfirmModalProps> = ({
  status,
  description,
  scannerURL,
  confirm,
  close,
}) => {
  useEscCloseModal(close);

  return (
    <TransactionConfirmModalWrapper className="modal-body-wrapper">
      <div className="modal-body submitted-modal">
        <div className="modal-header model-header-submitted">
          <div className="close-wrap" onClick={close}>
            <IconClose className="close-icon" />
          </div>
        </div>
        {status === "loading" && <TransactionConfirmLoading description={description} />}
        {status === "success" && <TransactionConfirmSubmitted confirm={confirm} scannerURL={scannerURL} close={close} />}
        {status === "error" && <TransactionConfirmFailed close={close} />}
        {status === "rejected" && <TransactionConfirmRejected close={close} />}
      </div>
    </TransactionConfirmModalWrapper>
  );
};

interface TransactionConfirmLoadingProps {
  description: string | null
}
const TransactionConfirmLoading: React.FC<TransactionConfirmLoadingProps> = ({
  description,
}) => {

  return (
    <React.Fragment>
      <div className="animation">
        <LoadingSpinner />
      </div>
      <div className="transaction-state">
        <span className="submitted">Waiting for Confirmation</span>
        <span className="swap-message">{description || ""}</span>
        <div className="view-transaction">
          <span>Confirm this transaction in your wallet</span>
        </div>
      </div>
    </React.Fragment>
  );
};

interface TransactionConfirmSubmittedProps {
  scannerURL: string | null;
  confirm: () => void;
  close: () => void;
}
const TransactionConfirmSubmitted: React.FC<TransactionConfirmSubmittedProps> = ({
  scannerURL,
  confirm,
  close,
}) => {
  const moveScanner = useCallback(() => {
    if (!scannerURL) {
      close();
      return;
    }
    window.open(scannerURL, "_blank");
  }, [close, scannerURL]);

  return (
    <React.Fragment>
      <div className="animation">
        <IconSuccess className="animation-logo" />
      </div>
      <div className="transaction-state">
        <span className="submitted">Transaction Submitted</span>
        <div className="view-transaction">
          <span>View Transaction</span>
          <div
            className="open-link"
            onClick={moveScanner}
          >
            <IconOpenLink className="open-logo" />
          </div>
        </div>
      </div>
      <div className="close-button">
        <Button
          text="Close"
          style={{
            fullWidth: true,
            fontType: "body7",
            hierarchy: ButtonHierarchy.Primary,
          }}
          onClick={confirm}
        />
      </div>
    </React.Fragment>
  );
};

interface TransactionConfirmFailedProps {
  close: () => void;
}
const TransactionConfirmFailed: React.FC<TransactionConfirmFailedProps> = ({
  close,
}) => {
  return (
    <React.Fragment>
      <div className="animation">
        <IconFailed className="animation-logo" />
      </div>
      <div className="transaction-state">
        <span className="submitted">Broadcasting Failed</span>
        <div className="view-transaction">
          <span>
            Your transcation has not been broadcasted. <br className="br" />
            Please try again.
          </span>
        </div>
      </div>
      <div className="close-button">
        <Button
          text="Close"
          style={{
            fullWidth: true,
            height: 57,
            fontType: "body7",
            hierarchy: ButtonHierarchy.Primary,
          }}
          onClick={close}
        />
      </div>
    </React.Fragment>
  );
};

interface TransactionConfirmRejectedProps {
  close: () => void
}
const TransactionConfirmRejected: React.FC<TransactionConfirmRejectedProps> = ({
  close,
}) => {
  return (
    <React.Fragment>
      <div className="animation">
        <IconFailed className="animation-logo" />
      </div>
      <div className="transaction-state">
        <span className="submitted">Transaction Rejected</span>
        <div className="view-transaction">
          <span>
            Your transaction has been rejected.<br /> Please try again.
          </span>
        </div>
      </div>
      <div className="close-button">
        <Button
          text="Close"
          style={{
            fullWidth: true,
            height: 57,
            fontType: "body7",
            hierarchy: ButtonHierarchy.Primary,
          }}
          onClick={close}
        />
      </div>
    </React.Fragment>
  );
};

export default TransactionConfirmModal;
