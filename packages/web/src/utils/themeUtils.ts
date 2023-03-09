import { THEME_MAP } from "@constants/theme.constant";
import { Theme } from "@emotion/react";

export const getTheme = (themeKey: "dark" | "light"): Theme => {
  return THEME_MAP[themeKey];
};
