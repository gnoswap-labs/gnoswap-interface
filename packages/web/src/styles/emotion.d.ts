import { FontsType, PaletteType } from "./ThemeType";
import "@emotion/react";
declare module "@emotion/react" {
  export interface Theme {
    fonts: FontsType;
    colors: PaletteType;
  }
}
