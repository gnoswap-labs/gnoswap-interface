import theme, { darkTheme } from "@/styles/theme";
import { Theme } from "@emotion/react";

export const getTheme = (themeKey: string): Theme => {
  return { ...theme, colors: darkTheme };
};
