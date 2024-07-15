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
import { DEFAULT_SLIPPAGE, MAX_SLIPPAGE, MIN_SLIPPAGE } from "@constants/option.constant";

interface SettingMenuModalProps {
  slippage: number;
  changeSlippage: (value: number) => void;
  close: () => void;
  className?: string;
}

const SettingMenuModal: React.FC<SettingMenuModalProps> = ({
  slippage,
  changeSlippage,
  close,
  className,
}) => {
  const [tmpSlippage, setTmpSlippage] = useState<string>(slippage.toString());
  const settingMenuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resetButtonRef = useRef<HTMLButtonElement | null>(null);
  const wrapperInputRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLDivElement | null>(null);
  
  const closeWithoutUpdate = useCallback(() => {
    changeSlippage(slippage);
    close();
  }, [close, changeSlippage, slippage]);
  useEscCloseModal(closeWithoutUpdate);

  const closeWithUpdate = useCallback(() => {
    if (inputRef && inputRef.current) {
      if (Number(inputRef.current.value) > MAX_SLIPPAGE) {
        changeSlippage(MAX_SLIPPAGE);
      } else {
        changeSlippage(Number(inputRef.current.value));
      }
    }
    close();
  }, [close, changeSlippage]);
  
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
      setTmpSlippage(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    }
  }, [setTmpSlippage]);

  const onClickReset = useCallback(() => {
    setTmpSlippage(DEFAULT_SLIPPAGE.toString());
  }, [setTmpSlippage]);

  const handleEnterKey = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = event.currentTarget.value;
      if (inputRef && inputRef.current) {
        inputRef.current.blur();
      }
      if (value === "") {
        changeSlippage(MIN_SLIPPAGE);
        setTmpSlippage(MIN_SLIPPAGE.toString());
      } else if (Number(value) > MAX_SLIPPAGE) {
        changeSlippage(MAX_SLIPPAGE);
        setTmpSlippage(MAX_SLIPPAGE.toString());
      } else {
        changeSlippage(Number(value));
      }
      close();
    }
  }, [changeSlippage, setTmpSlippage, close]);
  
  return (
    <>
      <SettingMenuModalWrapper ref={settingMenuRef} className={className} >
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
              buttonRef={resetButtonRef}
              onClick={onClickReset}
            />
            <div className="input-button" ref={wrapperInputRef}>
              <input
                className="amount-text"
                value={tmpSlippage}
                onChange={onChangeSlippage}
                placeholder="0"
                onKeyDown={handleEnterKey}
                ref={inputRef}
              />
              <span>%</span>
            </div>
          </div>
        </div>
      </SettingMenuModalWrapper>
      <Overlay onClick={closeWithUpdate}/>
    </>
  );
};

export default SettingMenuModal;
