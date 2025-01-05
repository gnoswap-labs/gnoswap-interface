import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { cx } from "@emotion/css";

import { useSocialWalletContext } from "@hooks/common/use-social-wallet-context";
import { SocialWalletLoginType } from "@providers/social-wallet-provider";

import { ConnectWalletModalWrapper } from "./ConnectWalletModal.styles";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import IconClose from "../icons/IconCancel";
import Button, { ButtonHierarchy } from "../button/Button";
import IconAdenaLogo from "@components/common/icons/defaultIcon/IconAdenaLogo";
import IconArrowRight from "../icons/IconArrowRight";
import IconGoogleLogo from "../icons/defaultIcon/IconGoogleLogo";
import IconTwitterLogo from "../icons/defaultIcon/IconTwitterLogo";
import ConnectWalletModalDivider from "./connect-wallet-modal-divider/ConnectWalletModalDivider";

interface Props {
  close: () => void;
  connect: () => void;
  loadingConnect: string;
}

const ConnectWalletModal: React.FC<Props> = ({ close, connect, loadingConnect }) => {
  const { connect: socialWalletConnect, disconnect } = useSocialWalletContext();
  const { t } = useTranslation();

  const handleSocialConnect = useCallback(
    async (type: SocialWalletLoginType) => {
      // disconnect();
      try {
        await socialWalletConnect(type);
      } catch {}
    },
    [socialWalletConnect],
  );

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
          {/* Email Login */}
          <div className="login-section" style={{ "--login-section-gap": "4px" } as React.CSSProperties}>
            <div className={cx("email-section", { error: false })}>
              <input
                placeholder="Email Address"
                type="email"
                inputMode="email"
                autoComplete={"off"}
                spellCheck={"false"}
              />
              <button
                onClick={() => {
                  handleSocialConnect("email");
                }}
              >
                <IconArrowRight className="right-chevron" />
              </button>
            </div>
            {false && <div className="validation-message">Please enter a valid email</div>}
          </div>

          <ConnectWalletModalDivider />

          {/* Social Logins */}
          <div className="login-section">
            <Button
              text="Sign in With Google"
              leftIcon={<IconGoogleLogo />}
              onClick={() => handleSocialConnect("google")}
              style={{
                hierarchy: ButtonHierarchy.Dark,
                fullWidth: true,
              }}
              className="button-connect"
            />

            <Button
              text="Sign in With X"
              leftIcon={<IconTwitterLogo />}
              onClick={() => handleSocialConnect("twitter")}
              style={{
                hierarchy: ButtonHierarchy.Dark,
                fullWidth: true,
              }}
              className="button-connect"
            />

            <Button
              text="Disconnect"
              onClick={disconnect}
              style={{
                hierarchy: ButtonHierarchy.Dark,
                fullWidth: true,
              }}
              className="button-connect"
            />
          </div>

          <ConnectWalletModalDivider />

          {/* Adena Wallet */}
          <div>
            <Button
              text={loadingConnect === "loading" || loadingConnect === "done" ? "" : "Adena Wallet"}
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
        </div>
        <div className="footer">
          <Trans ns="Modal" i18nKey={"walletLogin.desc"}>
            By connecting a wallet, you agree to our
            <a href="/terms" target="_blank">
              Terms of Use
            </a>
            and consent to our
            <a href="/privacy" target="_blank">
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
