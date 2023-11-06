import { ConnectWalletModalWrapper } from "./ConnectWalletModal.styles";
import React, { useCallback } from "react";
import IconClose from "../icons/IconCancel";
import Button, { ButtonHierarchy } from "../button/Button";
import IconAdenaLogo from "@components/common/icons/defaultIcon/IconAdenaLogo";
import IconWalletConnect from "../icons/defaultIcon/IconWalletConnect";

interface Props {
  close: () => void;
  connect: () => void;
}

const ConnectWalletModal: React.FC<Props> = ({ close, connect }) => {
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <ConnectWalletModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Connect Wallet</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div>
            <Button
              text="Adena"
              leftIcon={<IconAdenaLogo />}
              onClick={connect}
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              className="button-connect"
            />
          </div>
          <div>
            <Button
              leftIcon={<IconWalletConnect />}
              text="Wallet Connect"
              onClick={connect}
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              disabled
              className="button-connect"
            />
          </div>
        </div>
        <div className="footer">
          By connecting a wallet, you agree to Gnoswap Labs’{" "}
          <a href="/" target="_blank">
            Terms of Service
          </a>{" "}
          and consent to its{" "}
          <a href="/" target="_blank">
            Privacy Policy
          </a>
        </div>
      </div>
    </ConnectWalletModalWrapper>
  );
};

export default ConnectWalletModal;
