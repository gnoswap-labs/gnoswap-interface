import { FontsKeyType } from './themeType';
import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    fonts: FontsType,
    colors: {
      darkTheme: PaletteType,
      lightTheme: PaletteType,
    },
  }
}