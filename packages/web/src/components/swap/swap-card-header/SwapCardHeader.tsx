import IconLink from "@components/common/icons/IconLink";
import IconPolygon from "@components/common/icons/IconPolygon";
import IconSettings from "@components/common/icons/IconSettings";
import React from "react";
import SettingMenuModal from "../setting-menu-modal/SettingMenuModal";
import {
  CopyTooltip,
  SettingMenuButton,
  SwapCardHeaderWrapper,
} from "./SwapCardHeader.styles";
interface SwapCardHeaderProps {
  settingMenuToggle: boolean;
  onSettingMenu: () => void;
  tolerance: string;
  changeTolerance: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetTolerance: () => void;
  handleCopyClipBoard: (text: string) => void;
  copied: boolean;
}
const SwapCardHeader: React.FC<SwapCardHeaderProps> = ({
  settingMenuToggle,
  onSettingMenu,
  tolerance,
  changeTolerance,
  resetTolerance,
  handleCopyClipBoard,
  copied,
}) => {
  return (
    <SwapCardHeaderWrapper>
      <h2>Swap</h2>
      <div className="button-wrap">
        <div
          className="setting-wrap"
          onClick={() => handleCopyClipBoard("Copy Completed.")}
        >
          <>
            <IconLink className="setting-icon" />
            {copied && (
              <CopyTooltip>
                <div className="box">
                  <span>URL Copied!</span>
                </div>
                <IconPolygon className="polygon-icon" />
              </CopyTooltip>
            )}
          </>
        </div>
        <SettingMenuButton>
          <div className="setting-wrap" onClick={onSettingMenu}>
            <IconSettings className="setting-icon" />
          </div>
          {settingMenuToggle && (
            <SettingMenuModal
              onSettingMenu={onSettingMenu}
              tolerance={tolerance}
              changeTolerance={changeTolerance}
              resetTolerance={resetTolerance}
            />
          )}
        </SettingMenuButton>
      </div>
    </SwapCardHeaderWrapper>
  );
};

export default SwapCardHeader;
