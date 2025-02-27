import React from "react";
import { useTranslation } from "react-i18next";

import * as S from "./SettingUiMenu.styles";
import { useWindowSize } from "@hooks/common/use-window-size";
import { LANGUAGES } from "@constants/common.constant";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import ThemeModeContainer from "@containers/theme-mode-container/ThemeModeContainer";

interface SettingUiMenuProps {
  onMenuToggle: () => void;
  onClickChangeLanguage: () => void;
}

const SettingUiMenu = ({ onMenuToggle, onClickChangeLanguage }: SettingUiMenuProps) => {
  const { i18n, t } = useTranslation();
  const { width } = useWindowSize();

  return (
    <>
      <S.SettingUiMenuWrapper width={width}>
        <S.SettingUiMenuContent>
          <S.SettingUiMenuTitle>{t("Settings")}</S.SettingUiMenuTitle>
          <S.SettingUiMenuList>
            <div className="ui-setting-menu">
              <S.ThemeSelector>
                <span>{t("HeaderFooter:theme")}</span>
                <ThemeModeContainer />
              </S.ThemeSelector>
            </div>
            <div className="ui-setting-menu">
              <S.ThemeSelector>
                <span>{t("HeaderFooter:language")}</span>
                <div className="language" onClick={onClickChangeLanguage}>
                  {LANGUAGES.find(item => item.code === i18n.language)?.name} <IconStrokeArrowRight />
                </div>
              </S.ThemeSelector>
            </div>
          </S.SettingUiMenuList>
        </S.SettingUiMenuContent>
      </S.SettingUiMenuWrapper>
      <S.Overlay onClick={onMenuToggle} />
    </>
  );
};

export default SettingUiMenu;
