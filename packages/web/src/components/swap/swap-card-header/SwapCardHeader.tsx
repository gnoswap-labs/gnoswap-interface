import IconLink from "@components/common/icons/IconLink";
import IconPolygon from "@components/common/icons/IconPolygon";
import IconSettings from "@components/common/icons/IconSettings";
import React, { useCallback, useState } from "react";
import SettingMenuModal from "../setting-menu-modal/SettingMenuModal";
import {
  CopyTooltip,
  SettingMenuButton,
  SwapCardHeaderWrapper,
} from "./SwapCardHeader.styles";
interface SwapCardHeaderProps {
  copied: boolean;
  copyURL: () => void;
  slippage: number;
  changeSlippage: (value: string) => void;
  themeKey: "dark" | "light";
}
const SwapCardHeader: React.FC<SwapCardHeaderProps> = ({
  copied,
  copyURL,
  slippage,
  changeSlippage,
  themeKey,
}) => {
  const [openedSetting, setOpenedSetting] = useState(false);

  const openSetting = useCallback(() => {
    setOpenedSetting(true);
  }, []);

  const closeSetting = useCallback(() => {
    setOpenedSetting(false);
  }, []);

  return (
    <SwapCardHeaderWrapper>
      <h2>Swap</h2>
      <div className="button-wrap">
        <div
          className="setting-wrap"
          onClick={copyURL}
        >
          <>
            <IconLink className="setting-icon" />
            {copied && (
              <CopyTooltip>
                <div className={`box ${themeKey}-shadow`}>
                  <span>Swap URL Copied!</span>
                </div>
                <IconPolygon className="polygon-icon" />
              </CopyTooltip>
            )}
          </>
        </div>
        <SettingMenuButton>
          <div className="setting-wrap" onClick={openSetting}>
            <IconSettings className="setting-icon" />
          </div>
          {openedSetting && (
            <SettingMenuModal
              slippage={slippage}
              changeSlippage={changeSlippage}
              close={closeSetting}
            />
          )}
        </SettingMenuButton>
      </div>
    </SwapCardHeaderWrapper>
  );
};

export default SwapCardHeader;
