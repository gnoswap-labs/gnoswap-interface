import { ThemeState } from "@/states";
import ThemeModeButton from "@components/common/theme-mode-button/ThemeModeButton";
import React from "react";
import { useRecoilState } from "recoil";

const ThemeModeContainer: React.FC = () => {
  const [themeKey, setThemeKey] = useRecoilState(ThemeState.themeKey);

  const toggleTheme = () => {
    setThemeKey((key: string) => (key === "dark" ? "light" : "dark"));
  };
  return <ThemeModeButton themeKey={themeKey} toggleTheme={toggleTheme} />;
};

export default ThemeModeContainer;
