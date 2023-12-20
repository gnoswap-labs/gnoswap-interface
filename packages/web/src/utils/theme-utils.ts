import { ThemeKeys } from "@styles/ThemeTypes";
import {
  DARK_THEME_COLORS,
  THEME_WINDOW_SIZES,
  LIGHT_THEME_COLORS,
} from "@constants/theme.constant";
import { Theme } from "@emotion/react";

export const getTheme = (themeKey: ThemeKeys): Theme => {
  const color = themeKey === "dark" ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
  const windowSize = THEME_WINDOW_SIZES;

  return {
    color,
    windowSize,
    themeKey
  };
};
