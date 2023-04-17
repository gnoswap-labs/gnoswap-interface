import { css } from "@emotion/react";
import { PaletteType } from "@styles/ThemeTypes";

const darkThemeColors: PaletteType = {
  colorBlack: "#0A0E17",
  colorWhite: "#FFFFFF",
  colorPoint: "#0059FF",
  colorGreen: "#60E66A",
  colorRed: "#FF503F",
  gray01: "#DADADA",
  gray10: "#E0E8F4",
  gray20: "#C3D2EA",
  gray30: "#90A2C0",
  gray40: "#596782",
  gray50: "#1C2230",
  gray60: "#141A29",
  brand10: "#D2DCFB",
  brand20: "#A7B9F8",
  brand30: "#788FEB",
  brand40: "#536CD7",
  brand50: "#233DBD",
  brand60: "#192EA2",
  brand70: "#112188",
  brand80: "#0B166D",
  brand90: "#060E5A",
  opacityDark04: "rgba(224, 232, 244, 0.4)",
  opacityDark05: "rgba(20, 26, 41, 0.5)",
  opacityDark07: "rgba(10, 14, 23, 0.7)",
} as const;

const lightThemeColors: PaletteType = {
  colorBlack: "#0A0E17",
  colorWhite: "#FFFFFF",
  colorPoint: "#0059FF",
  colorGreen: "#60E66A",
  colorRed: "#FF503F",
  gray01: "#DADADA",
  gray10: "#E0E8F4",
  gray20: "#C3D2EA",
  gray30: "#90A2C0",
  gray40: "#596782",
  gray50: "#1C2230",
  gray60: "#141A29",
  brand10: "#D2DCFB",
  brand20: "#A7B9F8",
  brand30: "#788FEB",
  brand40: "#536CD7",
  brand50: "#233DBD",
  brand60: "#192EA2",
  brand70: "#112188",
  brand80: "#0B166D",
  brand90: "#060E5A",
  opacityDark04: "rgba(224, 232, 244, 0.4)",
  opacityDark05: "rgba(20, 26, 41, 0.5)",
  opacityDark07: "rgba(10, 14, 23, 0.7)",
} as const;

export const THEME_MAP = {
  dark: {
    colors: darkThemeColors,
  },
  light: {
    colors: lightThemeColors,
  },
};
