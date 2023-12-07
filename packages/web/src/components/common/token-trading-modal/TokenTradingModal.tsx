import React, { useCallback } from "react";
import IconClose from "../icons/IconCancel";
import { TokenTradingModalWrapper } from "./TokenTradingModal.styles";
import IconFailed from "../icons/IconFailed";
import Button, { ButtonHierarchy } from "../button/Button";
import IconNewTab from "../icons/IconNewTab";
import IconCopy from "../icons/IconCopy";

interface Props {
  close: () => void;
  onClickConfirm: () => void;
}

const TokenTradingModal: React.FC<Props> = ({ close, onClickConfirm }) => {
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
              This token isn’t frequently swapped on Gnoswap.<br /> Always conduct your own research before trading.
            </div>
          </div>
          <div className="link">
            <a href="/" target="_blank">https://gnoscan.io/tokens/gno.land/r/hopusd...</a>
            <IconNewTab className="new-tab"/>
            <IconCopy className="icon-copy"/>
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
            <p onClick={onClickClose}>Cancel</p>
          </div>
        </div>
      </div>
    </TokenTradingModalWrapper>
  );
};

export default TokenTradingModal;
