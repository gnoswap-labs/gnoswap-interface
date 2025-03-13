import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { cx } from "@emotion/css";
import { useTheme } from "@emotion/react";

import { useSocialWalletContext } from "@hooks/common/use-social-wallet-context";
import { SocialWalletLoginType } from "@providers/social-wallet-provider";
import { useConnectSocialWalletModal } from "@hooks/wallet/ui/use-connect-social-wallet-modal";

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
  const theme = useTheme();
  const { connect: socialWalletConnect } = useSocialWalletContext();
  const { t } = useTranslation();
  const { openModal: openSocialLoadingModal } = useConnectSocialWalletModal();

  const [email, setEmail] = React.useState<string>("");
  const [isEmailValid, setIsEmailValid] = React.useState<boolean>(false);
  const [isSubmitAttempted, setIsSubmitAttempted] = React.useState<boolean>(false);
  const isEmailErrorVisible = !!email && !isEmailValid && isSubmitAttempted;

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(isValidEmail(value));
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitAttempted(true);

    if (isEmailValid) {
      handleSocialConnect("email", email);
    }
  };

  const handleSocialConnect = async (type: SocialWalletLoginType, email?: string) => {
    try {
      close();
      openSocialLoadingModal(type);
      await socialWalletConnect(type, email);
    } catch {}
  };

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
            <div className={cx("email-section", { error: isEmailErrorVisible })}>
              <input
                placeholder={t("common:social.connect.email.placeholder")}
                type="email"
                inputMode="email"
                autoComplete={"off"}
                value={email}
                onChange={handleEmailChange}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    handleEmailSubmit(e);
                  }
                }}
                spellCheck={"false"}
              />
              <button onClick={handleEmailSubmit}>
                <IconArrowRight className="right-chevron" />
              </button>
            </div>
            {isEmailErrorVisible && (
              <div className="validation-message">{t("common:social.connect.email.invalid")}</div>
            )}
          </div>

          <ConnectWalletModalDivider />

          {/* Social Logins */}
          <div className="login-section social-login-section">
            <Button
              text={t("common:social.connect.sign.google")}
              leftIcon={<IconGoogleLogo />}
              onClick={() => handleSocialConnect("google")}
              style={{
                hierarchy: ButtonHierarchy.Dark,
                fullWidth: true,
              }}
              className="button-connect dark"
            />

            <Button
              text={t("common:social.connect.sign.x")}
              leftIcon={<IconTwitterLogo fill={theme.themeKey === "dark" ? "white" : "black"} />}
              onClick={() => handleSocialConnect("twitter")}
              style={{
                hierarchy: ButtonHierarchy.Dark,
                fullWidth: true,
              }}
              className="button-connect dark"
            />
          </div>

          <ConnectWalletModalDivider />

          {/* Adena Wallet */}
          <div>
            <Button
              text={loadingConnect === "loading" || loadingConnect === "done" ? "" : "Adena"}
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
              className="button-connect primary"
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
