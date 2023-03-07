import { FontsKeyType, PaletteLightType } from './theme-type';
import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    fonts: FontsKeyType,
    colors: {
      darkTheme: Palette,
      lightTheme: Palette,
    },
  }
}
