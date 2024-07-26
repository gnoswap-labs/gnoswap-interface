import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { Provider as JotaiProvider } from "jotai";
import GnoswapModalProvider from "@providers/gnoswap-modal-provider/GnoswapModalProvider";
import ModalContainer from "@containers/modal-container/ModalContainer";
import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import BackgroundContainer from "@containers/background-container/BackgroundContainer";
import Notice from "@components/common/notice/NoticeToast";
import ScrollTopWrapper from "@components/common/scroll-top-wrapper/ScrollTopWrapper";
import ErrorBoundary from "@components/common/error-boundary/ErrorBoundary";
import Custom500 from "./500";
import { appWithTranslation, UserConfig, useTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config.js";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/de";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/ja";
import "dayjs/locale/ko";
import "dayjs/locale/ru";
import "dayjs/locale/zh";
import "dayjs/locale/hi";

function App({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchInterval: 60 * 1000,
          },
        },
      }),
  );

  useEffect(() => {
    i18n.on("languageChanged", lang => {
      dayjs.locale(lang);
    });

    return () => i18n.off("languageChanged");
  }, [i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <JotaiProvider>
          <GnoswapServiceProvider>
            <GnoswapThemeProvider>
              <BackgroundContainer>
                <Notice>
                  <ScrollTopWrapper>
                    <ErrorBoundary fallback={<Custom500 />}>
                      <Component {...pageProps} />
                    </ErrorBoundary>
                  </ScrollTopWrapper>
                  <GnoswapModalProvider selector={"portal-root"}>
                    <ModalContainer />
                  </GnoswapModalProvider>
                </Notice>
              </BackgroundContainer>
            </GnoswapThemeProvider>
          </GnoswapServiceProvider>
        </JotaiProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

/// Cast to fix type error from next-i18next.
/// Reference: https://github.com/i18next/next-i18next/issues/2049
export default appWithTranslation(App, {
  ...nextI18NextConfig,
  debug: false,
} as UserConfig);
