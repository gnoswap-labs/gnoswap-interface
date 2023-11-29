import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useCallback, useRef } from "react";
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
  const settingMenuRef = useRef<HTMLDivElement | null>(null);
  useEscCloseModal(close);

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
      changeSlippage(value);
    }
  }, [changeSlippage]);

  const onClickReset = useCallback(() => {
    changeSlippage(DEFAULT_SLIPPAGE);
  }, [changeSlippage]);

  const handleBlur = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!Number(value)) {
      changeSlippage(DEFAULT_SLIPPAGE);
    } else if (Number(value) > 100) {
      changeSlippage("100");
    }
    
  }, [changeSlippage]);

  return (
    <>
      <SettingMenuModalWrapper ref={settingMenuRef} className={className}>
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
                hierarchy: ButtonHierarchy.Primary,
              }}
              onClick={onClickReset}
            />
            <div className="input-button">
              <input
                className="amount-text"
                value={slippage}
                onChange={onChangeSlippage}
                placeholder="0"
                onBlur={handleBlur}
              />
              <span>%</span>
            </div>
          </div>
        </div>
      </SettingMenuModalWrapper>
      <Overlay onClick={close}/>
    </>
  );
};

export default SettingMenuModal;
