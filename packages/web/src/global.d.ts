/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="@emotion/react/types/css-prop" />

import { ThemeColorType, WindowSizeType } from "@styles/ThemeTypes";
import "@emotion/react";
import { ConnectionType } from "@app-types/navigator";

declare module "@emotion/react" {
  export interface Theme {
    color: ThemeColorType;
    windowSize: WindowSizeType;
    themeKey: "dark" | "light";
  }
}

declare global {
  interface Window {
    adena?: any;
  }

  interface Navigator {
    connection?: {
      effectiveType: ConnectionType;
      downlink: number;
      rtt: number;
      saveData: boolean;
      addEventListener: (type: string, listener: EventListener) => void;
      removeEventListener: (type: string, listener: EventListener) => void;
    };
  }
}

declare module "*.mdx";

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}
