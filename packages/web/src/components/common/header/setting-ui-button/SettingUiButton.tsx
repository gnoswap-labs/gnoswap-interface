import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";
import * as S from "./SettingUiButton.styles";
import IconSettings from "@components/common/icons/IconSettings";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import SelectLanguage from "./select-language/SelectLanguage";
import SettingUiMenu from "./setting-ui-menu/SettingUiMenu";

const SettingUiButton = () => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);
  const handleESC = () => {
    setToggle(prev => {
      if (prev.settingUI) {
        return { ...prev, settingUI: false };
      }
      return prev;
    });
  };
  useEscCloseModal(handleESC);
  usePreventScroll(toggle.settingUI);

  const handleSettingUiToggle = () => {
    setToggle(prev => ({
      ...prev,
      settingUI: !prev.settingUI,
    }));
  };

  const handleChangeLanguage = () => {
    setToggle(prev => ({
      ...prev,
      showLanguage: !prev.showLanguage,
    }));
  };

  return (
    <S.SettingWrapper>
      <S.SettingButton
        onClick={() => {
          handleSettingUiToggle();
        }}
      >
        <IconSettings className="setting-icon" />
      </S.SettingButton>

      {toggle.settingUI && (
        <SettingUiMenu onMenuToggle={handleSettingUiToggle} onClickChangeLanguage={handleChangeLanguage} />
      )}
      {toggle.showLanguage && <SelectLanguage onClickChangeLanguage={handleChangeLanguage} />}
    </S.SettingWrapper>
  );
};

export default SettingUiButton;
