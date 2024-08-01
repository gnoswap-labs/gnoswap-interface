import { ConnectWalletStatusModalWrapper } from "./ConnectWalletStatusModal.styles";
import React, { useCallback } from "react";
import IconClose from "../icons/IconCancel";
import Button, { ButtonHierarchy } from "../button/Button";
import IconFailed from "../icons/IconFailed";
import { useTranslation } from "react-i18next";

interface Props {
  close: () => void;
  connect: () => void;
}

const ConnectWalletStatusModal: React.FC<Props> = ({ close, connect }) => {
  const { t } = useTranslation();

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
          <h5>{t("Modal:connectWallet.failed.title")}</h5>
          <div>{t("Modal:connectWallet.failed.desc")}</div>
        </div>
        <div className="button-wrapper">
          <Button
            text={t("Modal:connectWallet.tryAgain")}
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
