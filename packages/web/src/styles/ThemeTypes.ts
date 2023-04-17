import { THEME_MAP } from "@constants/theme.constant";
import { SerializedStyles } from "@emotion/react";

export type PaletteKeyType =
  | "colorBlack"
  | "colorWhite"
  | "colorPoint"
  | "colorGreen"
  | "colorRed"
  | "gray01"
  | "gray10"
  | "gray20"
  | "gray30"
  | "gray40"
  | "gray50"
  | "gray60"
  | "brand10"
  | "brand20"
  | "brand30"
  | "brand40"
  | "brand50"
  | "brand60"
  | "brand70"
  | "brand80"
  | "brand90"
  | "opacityDark04"
  | "opacityDark05"
  | "opacityDark07";

export type PaletteType = { [key in PaletteKeyType]: string };
export type ThemeKeys = keyof typeof THEME_MAP;
