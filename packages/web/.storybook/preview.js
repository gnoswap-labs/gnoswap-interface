import React from "react";
import GnoswapThemeProvider from "../src/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { getTheme } from "@utils/theme-utils";
import { Provider as JotaiProvider } from "jotai";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import enGovernance from "../public/locales/en/Governance.json";
import koGovernance from "../public/locales/ko/Governance.json";
import enCommon from "../public/locales/en/common.json";
import koCommon from "../public/locales/ko/common.json";

export const initialGlobals = { locale: "en" };

export const globalTypes = {
  locale: {
    description: "Preview language",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", title: "English" },
        { value: "ko", title: "한국어" },
      ],
    },
  },
};

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
  function WithProviders(Story, context) {
    const locale = context.globals.locale || "en";
    const storyI18n = React.useMemo(() => {
      const instance = createInstance();
      instance.init({
        lng: locale,
        fallbackLng: "en",
        initImmediate: false,
        interpolation: { escapeValue: false },
        resources: {
          en: { Governance: enGovernance, common: enCommon },
          ko: { Governance: koGovernance, common: koCommon },
        },
      });
      return instance;
    }, [locale]);
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
