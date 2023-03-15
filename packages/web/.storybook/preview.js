import React from "react";

import GnoswapThemeProvider from "../src/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { getTheme } from "@utils/themeUtils";
import { RecoilRoot } from "recoil";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story, context) => {
    return (
      <RecoilRoot>
        <GnoswapThemeProvider
          theme={getTheme(context.parameters.theme || "dark")}
        >
          <Story />
        </GnoswapThemeProvider>
      </RecoilRoot>
    );
  },
];
