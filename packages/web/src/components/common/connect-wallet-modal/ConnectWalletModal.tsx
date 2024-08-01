import { ConnectWalletModalWrapper } from "./ConnectWalletModal.styles";
import React, { useCallback } from "react";
import IconClose from "../icons/IconCancel";
import Button, { ButtonHierarchy } from "../button/Button";
import IconAdenaLogo from "@components/common/icons/defaultIcon/IconAdenaLogo";
import IconWalletConnect from "../icons/defaultIcon/IconWalletConnect";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { Trans, useTranslation } from "react-i18next";

interface Props {
  close: () => void;
  connect: () => void;
  loadingConnect: string;
}

const ConnectWalletModal: React.FC<Props> = ({
  close,
  connect,
  loadingConnect,
}) => {
  const { t } = useTranslation();

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <ConnectWalletModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>{t("Modal:walletLogin.title")}</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div>
            <Button
              text={
                loadingConnect === "loading" || loadingConnect === "done"
                  ? ""
                  : "Adena"
              }
              leftIcon={
                loadingConnect === "loading" || loadingConnect === "done" ? (
                  <LoadingSpinner className="loading-button" />
                ) : (
                  <IconAdenaLogo />
                )
              }
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
              text={t("Modal:walletLogin.btn.connect")}
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
          <Trans ns="Modal" i18nKey={"walletLogin.desc"}>
            By connecting a wallet, you agree to our
            <a href="/" target="_blank">
              Terms of Service
            </a>
            and consent to our
            <a href="/" target="_blank">
              Privacy Policy
            </a>
            .
          </Trans>
        </div>
      </div>
    </ConnectWalletModalWrapper>
  );
};

export default ConnectWalletModal;
