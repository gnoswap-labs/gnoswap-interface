import React from "react";
import Link from "next/link";

import { SOCIAL_WALLET_EXTERNAL_URL } from "@constants/external-url.contant";

import { ConnectedSocialWalletModalWrapper } from "./ConnectedSocialWalletModal.styles";
import Button, { ButtonHierarchy } from "../button/Button";
import IconClose from "../icons/IconCancel";
import IconFailed from "../icons/IconFailed";
import IconNewTab from "../icons/IconNewTab";
import { Trans, useTranslation } from "react-i18next";

interface Props {
  /** Callback function to close the modal */
  close: () => void;
  /** Callback function to handle the "Don't show again" button click */
  onDontShowAgain: () => void;
}

const ConnectedSocialWalletModal = ({ close, onDontShowAgain }: Props) => {
  const { t } = useTranslation();
  const handleConfirm = React.useCallback(() => close(), [close]);

  const handleDontShowAgain = React.useCallback(() => {
    onDontShowAgain();
    close();
  }, [close, onDontShowAgain]);

  return (
    <ConnectedSocialWalletModalWrapper>
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
            <h5>{t("common:social.modal.warning.title")}</h5>
            <div className="description">
              <Trans i18nKey={"common:social.modal.warning.desc"} components={{ br: <br /> }} />
            </div>
            <div className="link-wrapper">
              <div className="link">
                <ExternalLink href={SOCIAL_WALLET_EXTERNAL_URL.ADENA_INSTALL_URL}>
                  <div>{t("common:social.modal.warning.link.adena")}</div>
                </ExternalLink>
              </div>
              <div className="link">
                <ExternalLink href={SOCIAL_WALLET_EXTERNAL_URL.SOCIAL_WALLET_FAQ_URL}>
                  <div>{t("common:social.modal.warning.link.faq")}</div>
                </ExternalLink>
              </div>
            </div>

            <div className="button-wrapper">
              <Button
                text={t("Modal:tokenTradingWarn.understand")}
                style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
                onClick={handleConfirm}
                className="button-confirm"
              />
              <div className="cancel-button" onClick={handleDontShowAgain} role="button" tabIndex={0}>
                <span>{t("common:social.modal.warning.dontShow")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConnectedSocialWalletModalWrapper>
  );
};

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link className="url-wrapper" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <IconNewTab className="new-tab" />
    </Link>
  );
};

export default React.memo(ConnectedSocialWalletModal);
