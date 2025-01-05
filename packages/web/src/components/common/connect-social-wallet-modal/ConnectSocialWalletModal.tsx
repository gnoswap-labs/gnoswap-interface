import React from "react";

import { ConnectSocialWalletModalWrapper } from "./ConnectSocialWalletModal.styles";
import IconClose from "../icons/IconCancel";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import Button, { ButtonHierarchy } from "../button/Button";
import { useSocialWalletContext } from "@hooks/common/use-social-wallet-context";
import { SocialWalletLoginType } from "@providers/social-wallet-provider";

interface ConnectSocialWalletModalProps {
  close: () => void;
  loginType: SocialWalletLoginType;
}

const ConnectSocialWalletModal = ({ close, loginType }: ConnectSocialWalletModalProps) => {
  const { connectingState } = useSocialWalletContext();

  React.useEffect(() => {
    if (connectingState === "done" || connectingState === "error") {
      close();
    }
  }, [close, connectingState]);
  return (
    <ConnectSocialWalletModalWrapper>
      <div className="modal-body">
        <div className="header">
          <div className="close-wrap">
            <button onClick={close}>
              <IconClose className="close-icon" />
            </button>
          </div>
        </div>
        <div className="content">
          <div className="loading-spinner">
            <LoadingSpinner />
          </div>
          <div className="description">
            <div className="title">Connecting to {loginType}</div>
            {loginType === "email" ? (
              <div className="text">Check your email to approve the connection.</div>
            ) : (
              <div className="text">Authorize the connection in the popup window.</div>
            )}
          </div>
        </div>
        <div className="cancel-button">
          <Button style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }} text="Cancel" onClick={close} />
        </div>
      </div>
    </ConnectSocialWalletModalWrapper>
  );
};

export default ConnectSocialWalletModal;
