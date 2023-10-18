import Button from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useCallback, useRef } from "react";
import {
  ModalTooltipWrap,
  SettingMenuModalWrapper,
} from "./SettingMenuModal.styles";
import useModalCloseEvent from "@hooks/common/use-modal-close-event";

interface SettingMenuModalProps {
  slippage: number;
  changeSlippage: (value: string) => void;
  close: () => void;
}

const SettingMenuModal: React.FC<SettingMenuModalProps> = ({
  slippage,
  changeSlippage,
  close,
}) => {
  const settingMenuRef = useRef<HTMLDivElement | null>(null);
  useModalCloseEvent(settingMenuRef, close);

  const TooltipFloatingContent = (
    <ModalTooltipWrap>
      <div className="tooltip-wrap">
        <p>
          Your transactions will revert if the price <br />
          changes unfavorably by more than this <br />
          percentage.
        </p>
      </div>
    </ModalTooltipWrap>
  );

  const onChangeSlippage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    changeSlippage(value);
  }, [changeSlippage]);

  const onClickReset = useCallback(() => {
    changeSlippage("10");
  }, [changeSlippage]);

  return (
    <SettingMenuModalWrapper ref={settingMenuRef}>
      <div className="modal-body">
        <div className="modal-header">
          <span>Settings</span>
          <div className="close-wrap" onClick={close}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="title">
          <span>Slippage tolerance</span>
          <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
            <div className="info-wrap">
              <IconInfo className="info-icon" />
            </div>
          </Tooltip>
        </div>
        <div className="setting-input">
          <Button
            text="Auto"
            style={{
              width: 62,
              height: 36,
              fontType: "p1",
              textColor: "text20",
            }}
            onClick={onClickReset}
          />
          <div className="input-button">
            <input
              className="amount-text"
              value={slippage}
              onChange={onChangeSlippage}
              placeholder="0"
            />
            <span>%</span>
          </div>
        </div>
      </div>
    </SettingMenuModalWrapper>
  );
};

export default SettingMenuModal;
