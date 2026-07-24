import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { TokenModel } from "@models/token/token-model";
import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import Button, { ButtonHierarchy } from "../button/Button";
import IconClose from "../icons/IconCancel";
import IconCheck from "../icons/IconCheck";
import IconCopy from "../icons/IconCopy";
import IconFailed from "../icons/IconFailed";
import IconNewTab from "../icons/IconNewTab";
import { TokenTradingModalWrapper } from "./TokenWarningModal.styles";

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
  const tokenUrl = getTokenUrl(token.path);

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
              <Trans ns="Modal" i18nKey={"tokenTradingWarn.subtitle"} components={{ br: <br /> }} />
            </div>
          </div>
          <div className="link">
            <a className="url-wrapper" href={tokenUrl} target="_blank" rel="noopener noreferrer">
              <div>{tokenUrl}</div>
              <IconNewTab className="new-tab" />
            </a>
            <div className="icon-wrapper" onClick={handleChecked}>
              {checked ? <IconCheck className="icon-copy" /> : <IconCopy className="icon-copy" />}
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
          </div>
        </div>
      </div>
    </TokenTradingModalWrapper>
  );
};

export default TokenWarningModal;
