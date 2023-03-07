import { SerializedStyles } from "@emotion/react";
import { darkTheme, lightTheme } from "./theme";

export type FontsType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4'
  | 'body5'
  | 'body6'
  | 'body7'
  | 'body8'
  | 'body9'
  | 'body10'
  | 'body11'
  | 'body12'
  | 'p1'
  | 'p2'
  | 'p3'
  | 'p4'
  | 'p5'
  | 'p6'
  | 'p7';

export type PaletteType =
  | 'colorBlack'
  | 'colorWhite'
  | 'colorPoint'
  | 'colorGreen'
  | 'colorRed'
  | 'gray10'
  | 'gray20'
  | 'gray30'
  | 'gray40'
  | 'gray50'
  | 'gray60'
  | 'brand10'
  | 'brand20'
  | 'brand30'
  | 'brand40'
  | 'brand50'
  | 'brand60'
  | 'brand70'
  | 'brand80'
  | 'brand90'
  | 'opacityDark05'
  | 'opacityDark07'

export type TypeOfLight = typeof lightTheme;
export type TypeOfDark = typeof darkTheme;
export type Palette = { [key in PaletteType]: string };
export type PaletteLightType = TypeOfLight[PaletteType];
export type PaletteDarkType = TypeOfDark[PaletteType];
export type FontsKeyType = { [key in FontsType]: SerializedStyles };

