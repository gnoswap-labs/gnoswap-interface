import React from "react";

import { SessionExpiredModalWrapper } from "./SessionExpiredModal.styles";
import IconClose from "../icons/IconCancel";
import IconFailed from "../icons/IconFailed";
import Button, { ButtonHierarchy } from "../button/Button";

interface Props {
  close: () => void;
}

const SessionExpiredModal = ({ close }: Props) => {
  return (
    <SessionExpiredModalWrapper>
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
            <h5>Session Expired</h5>
            <div className="description">
              Your session has expired due to inactivity.
              <br /> Please log in again to continue.
            </div>
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
    </SessionExpiredModalWrapper>
  );
};

export default SessionExpiredModal;
