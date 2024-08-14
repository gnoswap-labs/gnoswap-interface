import React, { useCallback } from "react";
import IconClose from "../icons/IconCancel";
import { TokenTradingModalWrapper } from "./TokenWarningModal.styles";
import IconFailed from "../icons/IconFailed";
import Button, { ButtonHierarchy } from "../button/Button";
import IconNewTab from "../icons/IconNewTab";
import IconCopy from "../icons/IconCopy";
import IconCheck from "../icons/IconCheck";
import { TokenModel } from "@models/token/token-model";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { Trans, useTranslation } from "react-i18next";

interface TokenWarningModalProps {
  close: () => void;
  onClickConfirm: () => void;
  handleChecked: () => void;
  checked: boolean;
  token: { [key in string]: string } | TokenModel;
}

const TokenWarningModal: React.FC<TokenWarningModalProps> = ({
  close,
  onClickConfirm,
  checked,
  handleChecked,
  token,
}) => {
  const { t } = useTranslation();
  const { getTokenUrl } = useGnoscanUrl();

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <TokenTradingModalWrapper>
      <div className="modal-body">
        <div className="header">
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <IconFailed className="failed-logo" />
          <div className="detail">
            <h5>{t("Modal:tokenTradingWarn.title")}</h5>
            <div className="des">
              <Trans
                ns="Modal"
                i18nKey={"tokenTradingWarn.subtitle"}
                components={{ br: <br /> }}
              />
            </div>
          </div>
          <div className="link">
            <a
              className="url-wrapper"
              href={getTokenUrl(token.path)}
              target="_blank"
            >
              <div>{getTokenUrl(token.path)}</div>
              <IconNewTab className="new-tab" />
            </a>
            <div className="icon-wrapper" onClick={handleChecked}>
              {checked ? (
                <IconCheck className="icon-copy" />
              ) : (
                <IconCopy className="icon-copy" />
              )}
            </div>
          </div>
          <div>
            <Button
              text={t("Modal:tokenTradingWarn.understand")}
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              className="button-confirm"
              onClick={onClickConfirm}
            />
            <div className="cancel-button">
              <span onClick={onClickClose}>{t("common:action.cancel")}</span>
            </div>
          </div>
        </div>
      </div>
    </TokenTradingModalWrapper>
  );
};

export default TokenWarningModal;
