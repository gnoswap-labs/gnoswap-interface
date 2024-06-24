import { useState } from "react";
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

export default function App({ Component, pageProps }: AppProps) {
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
  // const { canScrollUp } = useScrollUp();

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <JotaiProvider>
          <GnoswapServiceProvider>
            <GnoswapThemeProvider>
              <BackgroundContainer>
                <Notice>
                  <Component {...pageProps} />
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
