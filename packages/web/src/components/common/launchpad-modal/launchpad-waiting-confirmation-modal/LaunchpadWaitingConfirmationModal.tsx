import React from "react";

import { LaunchpadWaitingConfirmationModalWrapper } from "./LaunchpadWaitingConfirmationModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

const LaunchpadWaitingConfirmationModal = () => {
  return (
    <LaunchpadWaitingConfirmationModalWrapper>
      <div className="modal-body">
        <div className="header">
          <div className="close-wrap">
            <IconClose className="close-icon" />
          </div>
        </div>

        <div className="content">
          <div className="loading-section">
            <LoadingSpinner />
          </div>
          <div className="text-section">
            <div className="title">Waiting for Confirmation</div>
            <div className="data">Depositing 400 GNS</div>
            <div className="description">
              Confirm this transaction in your wallet
            </div>
          </div>
        </div>
      </div>
    </LaunchpadWaitingConfirmationModalWrapper>
  );
};

export default LaunchpadWaitingConfirmationModal;
