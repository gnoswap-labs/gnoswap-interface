import Button from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useEffect, useRef } from "react";
import {
  ModalTooltipWrap,
  SettingMenuModalWrapper,
} from "./SettingMenuModal.styles";

interface SettingMenuModalProps {
  onSettingMenu: () => void;
  tolerance: string;
  changeTolerance: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetTolerance: () => void;
}

const SettingMenuModal: React.FC<SettingMenuModalProps> = ({
  onSettingMenu,
  tolerance,
  changeTolerance,
  resetTolerance,
}) => {
  const settingMenuRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (
        settingMenuRef.current &&
        settingMenuRef.current.contains(e.target as Node)
      ) {
        return;
      } else {
        e.stopPropagation();
        onSettingMenu();
      }
    };
    window.addEventListener("click", closeMenu, true);
    return () => {
      window.removeEventListener("click", closeMenu, true);
    };
  }, [settingMenuRef, onSettingMenu]);

  return (
    <SettingMenuModalWrapper ref={settingMenuRef}>
      <div className="modal-body">
        <div className="modal-header">
          <span>Settings</span>
          <div className="close-wrap" onClick={onSettingMenu}>
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
            onClick={resetTolerance}
          />
          <div className="input-button">
            <input
              className="amount-text"
              value={tolerance}
              onChange={changeTolerance}
              placeholder={tolerance === "" ? "0" : ""}
            />
            <span>%</span>
          </div>
        </div>
      </div>
    </SettingMenuModalWrapper>
  );
};

export default SettingMenuModal;
