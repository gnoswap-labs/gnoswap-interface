import React from "react";

import { LaunchpadClaimAllModalWrapper } from "./LaunchpadClaimAllModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import Button, { ButtonHierarchy } from "@components/common/button/Button";

const LaunchpadClaimAllModal = () => {
  return (
    <LaunchpadClaimAllModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Claim All</h6>
          <div className="close-wrap">
            <IconClose className="close-icon" />
          </div>
        </div>

        <div className="content">
          <div className="data">
            <div className="data-box">
              <div className="data-row">
                <div className="key">Pool</div>
                <div className="value">123</div>
              </div>
              <div className="data-row">
                <div className="key">Claimable</div>
                <div className="value">123</div>
              </div>
              <div className="data-row">
                <div className="key">Deposit Amount</div>
                <div className="value">123</div>
              </div>
            </div>
          </div>
          <div className="data">
            <div className="data-box">
              <div className="data-row">
                <div className="key">Pool</div>
                <div className="value">123</div>
              </div>
              <div className="data-row">
                <div className="key">Claimable</div>
                <div className="value">123</div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <ConfirmButton />
        </div>
      </div>
    </LaunchpadClaimAllModalWrapper>
  );
};

const ConfirmButton = () => {
  const defaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };
  return <Button text="Confirm" style={defaultStyle} />;
};

export default LaunchpadClaimAllModal;
