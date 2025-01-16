import React from "react";
import Link from "next/link";

import { ConnectedSocialWalletModalWrapper } from "./ConnectedSocialWalletModal.styles";
import Button, { ButtonHierarchy } from "../button/Button";
import IconClose from "../icons/IconCancel";
import IconFailed from "../icons/IconFailed";
import IconNewTab from "../icons/IconNewTab";

interface Props {
  /** Callback function to close the modal */
  close: () => void;
  /** Callback function to handle the "Don't show again" button click */
  onDontShowAgain: () => void;
}

const EXTERNAL_URLS = {
  ADENA_INSTALL_URL: "https://adena.app",
  SOCIAL_WALLET_FAQ_URL: "https://docs.gnoswap.io/references/faq",
} as const;

const ConnectedSocialWalletModal = ({ close, onDontShowAgain }: Props) => {
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
            <h5>Notice for Using Social Wallets</h5>
            <div className="description">
              You can use basic wallet features, such as transferring
              <br />
              assets and signing transactions, with a social wallet.
              <br />
              To access advanced wallet features, like exporting
              <br />
              private keys or changing networks, please install the
              <br />
              Adena wallet extensionand log in using the same social
              <br />
              account.
            </div>
            <div className="link-wrapper">
              <div className="link">
                <ExternalLink href={EXTERNAL_URLS.ADENA_INSTALL_URL}>
                  <div>Go to install Adena</div>
                </ExternalLink>
              </div>
              <div className="link">
                <ExternalLink href={EXTERNAL_URLS.SOCIAL_WALLET_FAQ_URL}>
                  <div>How does Social Wallets work?</div>
                </ExternalLink>
              </div>
            </div>

            <div className="button-wrapper">
              <Button
                text="I understand"
                style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
                onClick={handleConfirm}
                className="button-confirm"
              />
              <div className="cancel-button" onClick={handleDontShowAgain} role="button" tabIndex={0}>
                <span>Don’t show again for 30 days</span>
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
