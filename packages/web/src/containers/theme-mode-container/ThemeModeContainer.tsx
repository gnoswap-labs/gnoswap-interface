import { ThemeState } from "@/states";
import Header from "@components/common/header/Header";
import ThemeModeButton from "@components/common/theme-mode-button/ThemeModeButton";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

const ThemeModeContainer: React.FC = () => {
  const [themeKey, setThemeKey] = useRecoilState(ThemeState.themeKey);

  const toggleTheme = () => {
    setThemeKey((key: string) => (key === "dark" ? "light" : "dark"));
  };
  return <ThemeModeButton themeKey={themeKey} toggleTheme={toggleTheme} />;
};

export default ThemeModeContainer;
