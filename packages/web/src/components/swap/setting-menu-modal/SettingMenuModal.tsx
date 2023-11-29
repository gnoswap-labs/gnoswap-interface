import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useCallback, useRef, useState } from "react";
import {
  ModalTooltipWrap,
  Overlay,
  SettingMenuModalWrapper,
} from "./SettingMenuModal.styles";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { isAmount } from "@common/utils/data-check-util";
import { DEFAULT_SLIPPAGE } from "@constants/option.constant";

interface SettingMenuModalProps {
  slippage: string;
  changeSlippage: (value: string) => void;
  close: () => void;
  className?: string;
}

const SettingMenuModal: React.FC<SettingMenuModalProps> = ({
  slippage,
  changeSlippage,
  close,
  className,
}) => {
  const [previos, setPrevios] = useState(slippage);
  const settingMenuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const wrapperInputRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLDivElement | null>(null);
  
  const handleClose = useCallback(() => {
    changeSlippage(previos);
    close();
  }, [close, changeSlippage, previos]);
  useEscCloseModal(handleClose);

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
    if (value !== "" && !isAmount(value)) return;
    if (/^\d{0,10}(\.\d{0,2})?$/.test(value)) {
      changeSlippage(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    }
  }, [changeSlippage]);

  const onClickReset = useCallback(() => {
    changeSlippage(DEFAULT_SLIPPAGE);
  }, [changeSlippage]);
  
  const handleClickWrapper = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (buttonRef && buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        setPrevios(DEFAULT_SLIPPAGE);
        changeSlippage(DEFAULT_SLIPPAGE);
      return;
    }
    if (closeRef && closeRef.current && closeRef.current.contains(event.target as Node)) {
      changeSlippage(previos);
      return;
    }
    if (inputRef && inputRef.current && !inputRef.current.contains(event.target as Node)) {
      const value = inputRef.current.value;
      if (value === "") {
        changeSlippage("0");
        setPrevios("0");
      } else if (Number(value) > 30) {
        changeSlippage("30");
        setPrevios("30");
      } else {
        setPrevios(value);
        changeSlippage(value);
      }
    }
  }, [changeSlippage, setPrevios, previos]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      const value = event.currentTarget.value;
      if (inputRef && inputRef.current) {
        inputRef.current.blur();
      }
      if (value === "") {
        changeSlippage("0");
        setPrevios("0");
      } else if (Number(value) > 30) {
        changeSlippage("30");
        setPrevios("30");
      } else {
        setPrevios(value);
        changeSlippage(value);
      }
    }
  }, [changeSlippage, setPrevios]);
  
  return (
    <>
      <SettingMenuModalWrapper ref={settingMenuRef} className={className} onClick={handleClickWrapper}>
        <div className="modal-body">
          <div className="modal-header">
            <span>Settings</span>
            <div className="close-wrap" onClick={close} ref={closeRef}>
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
                hierarchy: ButtonHierarchy.Primary,
              }}
              buttonRef={buttonRef}
              onClick={onClickReset}
            />
            <div className="input-button" ref={wrapperInputRef}>
              <input
                className="amount-text"
                value={slippage}
                onChange={onChangeSlippage}
                placeholder="0"
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />
              <span>%</span>
            </div>
          </div>
        </div>
      </SettingMenuModalWrapper>
      <Overlay onClick={handleClose}/>
    </>
  );
};

export default SettingMenuModal;
