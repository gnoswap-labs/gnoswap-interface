import { ThemeKeys } from "@styles/ThemeTypes";
import { THEME_MAP } from "@constants/theme.constant";
import { Theme } from "@emotion/react";

export const getTheme = (themeKey: ThemeKeys): Theme => {
  return THEME_MAP[themeKey];
};
