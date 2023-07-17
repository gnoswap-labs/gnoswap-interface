import React from "react";
import GnoswapThemeProvider from "../src/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { getTheme } from "@utils/theme-utils";
import { Provider as JotaiProvider } from "jotai";

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
      <JotaiProvider>
        <GnoswapThemeProvider
          theme={getTheme(context.parameters.theme || "dark")}
        >
          <Story />
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
  },
];
