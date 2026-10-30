import React from "react";
import GnoswapThemeProvider from "../src/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { getTheme } from "@utils/theme-utils";
import { Provider as JotaiProvider } from "jotai";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import enGovernance from "../public/locales/en/Governance.json";
import koGovernance from "../public/locales/ko/Governance.json";

const storyI18n = createInstance();
storyI18n.init({
  lng: "en",
  fallbackLng: "en",
  initImmediate: false,
  interpolation: { escapeValue: false },
  resources: {
    en: { Governance: enGovernance },
    ko: { Governance: koGovernance },
  },
});

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
        <GnoswapThemeProvider theme={getTheme(context.parameters.theme || "dark")}>
          <I18nextProvider i18n={storyI18n}>
            <Story />
          </I18nextProvider>
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
  },
];
