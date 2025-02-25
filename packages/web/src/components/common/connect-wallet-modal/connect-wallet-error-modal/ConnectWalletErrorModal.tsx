import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconFailed from "@components/common/icons/IconFailed";
import React from "react";

import { ConnectWalletErrorModalWrapper } from "./ConnectWalletErrorModal.styles";

interface Props {
  close: () => void;
}

const ConnectWalletErrorModal = ({ close }: Props) => {
  return (
    <ConnectWalletErrorModalWrapper>
      <div className="modal-body">
        <div className="header">
          <div className="close-wrap">
            <button onClick={close}>
              <IconClose className="close-icon" />
            </button>
          </div>
        </div>

        <div className="content">
          <IconFailed className="warning-logo" />
          <div className="detail">
            <h5>Connection Failure</h5>
            <div className="description">Your connection has been failed. Please try again.</div>
          </div>
          <div className="button-wrapper">
            <Button
              text="Close"
              style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
              onClick={close}
              className="button-confirm"
            />
          </div>
        </div>
      </div>
    </ConnectWalletErrorModalWrapper>
  );
};

export default ConnectWalletErrorModal;
