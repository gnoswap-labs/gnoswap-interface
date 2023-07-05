import { ThemeAtom } from "@atoms/index";
import ThemeModeButton from "@components/common/theme-mode-button/ThemeModeButton";
import { useAtom } from "jotai";
import React from "react";

const ThemeModeContainer: React.FC = () => {
  const [themeKey, setThemeKey] = useAtom(ThemeAtom.themeKey);

  const toggleTheme = () => {
    setThemeKey((key: string) => (key === "dark" ? "light" : "dark"));
  };
  return <ThemeModeButton themeKey={themeKey} toggleTheme={toggleTheme} />;
};

export default ThemeModeContainer;
