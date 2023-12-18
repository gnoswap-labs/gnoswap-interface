import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconFailed from "@components/common/icons/IconFailed";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconSuccess from "@components/common/icons/IconSuccess";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { Overlay } from "@components/common/modal/Modal.styles";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { usePositionModal } from "@hooks/common/use-position-modal";
import React, { useRef } from "react";
import { WithdrawResponse } from "../useWithdrawTokens";
import {
  ConfirmModal,
  WithdrawStatusBackground,
} from "./WithdrawStatusModal.styles";

interface WithdrawStatusProps {
  swapResult: WithdrawResponse;
  close: () => void;
}

const WithdrawStatus: React.FC<WithdrawStatusProps> = ({
  swapResult,
  close,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEscCloseModal(close);
  usePositionModal(menuRef);

  return (
    <>
      <WithdrawStatusBackground>
        <ConfirmModal ref={menuRef} className={"modal-body-wrapper"}>
          <div
            className={`modal-body ${
              swapResult === null ? "modal-body-loading" : "submitted-modal"
            }`}
          >
            <div className={"modal-header model-header-submitted"}>
              <span />
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>
            <ConfirmWithdrawResult swapResult={swapResult} close={close} />
          </div>
        </ConfirmModal>
      </WithdrawStatusBackground>
      <Overlay onClick={close} />
    </>
  );
};

interface ConfirmWithdrawResultProps {
  swapResult: WithdrawResponse;
  close: () => void;
}

const ConfirmWithdrawResult: React.FC<ConfirmWithdrawResultProps> = ({
  swapResult,
  close,
}) => {
  if (swapResult === null) {
    return (
      <>
        <div className="animation">
          <LoadingSpinner />
        </div>
        <div className="transaction-state">
          <span className="submitted">Waiting for Confirmation</span>
          <div className="view-transaction">
            <span>Confirm this transaction in your wallet</span>
          </div>
        </div>
      </>
    );
  }

  if (swapResult.success) {
    return (
      <>
        <div className="animation">
          <IconSuccess className="animation-logo" />
        </div>
        <div className="transaction-state">
          <span className="submitted">Transaction Submitted</span>
          <div className="view-transaction">
            <span>View Transaction</span>
            <div
              className="open-link"
              onClick={() => {
                window.open(swapResult?.hash, "_blank");
              }}
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
            onClick={close}
          />
        </div>
      </>
    );
  }

  if (swapResult.code === 4000) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      <div className="animation">
        <IconFailed className="animation-logo" />
      </div>
      <div className="transaction-state">
        <span className="submitted">Transaction Rejected</span>
        <div className="view-transaction">
          <span>
            Your transaction has been rejected.
            <br /> Please try again.
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
    </>
  );
};

export default WithdrawStatus;
