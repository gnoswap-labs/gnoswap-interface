import IconLink from "@components/common/icons/IconLink";
import IconSettings from "@components/common/icons/IconSettings";
import React from "react";
import SettingMenuModal from "../setting-menu-modal/SettingMenuModal";
import {
  SettingMenuButton,
  SwapCardHeaderWrapper,
} from "./SwapCardHeader.styles";
interface SwapCardHeaderProps {
  settingMenuToggle: boolean;
  onSettingMenu: () => void;
  tolerance: string;
  changeTolerance: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const SwapCardHeader: React.FC<SwapCardHeaderProps> = ({
  settingMenuToggle,
  onSettingMenu,
  tolerance,
  changeTolerance,
}) => {
  return (
    <SwapCardHeaderWrapper>
      <h2>Swap</h2>
      <div className="button-wrap">
        <div className="setting-wrap">
          <IconLink className="setting-icon" />
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
            />
          )}
        </SettingMenuButton>
      </div>
    </SwapCardHeaderWrapper>
  );
};

export default SwapCardHeader;
