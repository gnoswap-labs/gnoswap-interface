/// <reference types="@emotion/react/types/css-prop" />

import { PaletteType } from "@styles/ThemeTypes";
import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: PaletteType;
  }
}

declare global {
  interface Window {
    adena?: any;
  }
}

declare module "*.mdx";

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;

  const src: string;
  export default src;
}
