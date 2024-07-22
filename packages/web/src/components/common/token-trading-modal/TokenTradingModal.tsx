import React, { useCallback } from "react";
import IconClose from "../icons/IconCancel";
import { TokenTradingModalWrapper } from "./TokenTradingModal.styles";
import IconFailed from "../icons/IconFailed";
import Button, { ButtonHierarchy } from "../button/Button";
import IconNewTab from "../icons/IconNewTab";
import IconCopy from "../icons/IconCopy";
import IconCheck from "../icons/IconCheck";
import { TokenModel } from "@models/token/token-model";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";

interface Props {
  close: () => void;
  onClickConfirm: () => void;
  handleChecked: () => void;
  checked: boolean;
  token: { [key in string]: string } | TokenModel;
}

const TokenTradingModal: React.FC<Props> = ({
  close,
  onClickConfirm,
  checked,
  handleChecked,
  token,
}) => {
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
            <h5>Token Trading Warning</h5>
            <div className="des">
              This token isn’t frequently swapped on GnoSwap.
              <br /> Always conduct your own research before trading.
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
              text="I understand"
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              className="button-confirm"
              onClick={onClickConfirm}
            />
            <div className="cancel-button">
              <span onClick={onClickClose}>Cancel</span>
            </div>
          </div>
        </div>
      </div>
    </TokenTradingModalWrapper>
  );
};

export default TokenTradingModal;
