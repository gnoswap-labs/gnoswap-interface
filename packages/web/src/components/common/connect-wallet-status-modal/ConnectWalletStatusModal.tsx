import { ConnectWalletStatusModalWrapper } from "./ConnectWalletStatusModal.styles";
import React, { useCallback } from "react";
import IconClose from "../icons/IconCancel";
import Button, { ButtonHierarchy } from "../button/Button";
import IconFailed from "../icons/IconFailed";

interface Props {
  close: () => void;
  connect: () => void;
}

const ConnectWalletStatusModal: React.FC<Props> = ({ close, connect }) => {
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <ConnectWalletStatusModalWrapper>
      <div className="modal-body">
        <div className="header">
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="icon-wrapper">
          <IconFailed className="fail-icon" />
        </div>
        <div className="content">
          <h5>
            Error Connecting
          </h5>
          <div>
            The connection attempt has failed. Please try again.
          </div>
        </div>
        <div className="button-wrapper">
          <Button
            text="Try Again"
            onClick={connect}
            style={{
              hierarchy: ButtonHierarchy.Primary,
              fullWidth: true,
            }}
            className="button-try"
          />
        </div>
      </div>
    </ConnectWalletStatusModalWrapper>
  );
};

export default ConnectWalletStatusModal;
