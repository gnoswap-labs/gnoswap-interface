import { useState } from "react";
import type { AppProps } from "next/app";
import { RecoilRoot, useRecoilValue } from "recoil";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { GnoswapProvider } from "@/common/providers";
import { Global, ThemeProvider } from "@emotion/react";
import globalStyle from "@/styles/global-style";
import theme from "@/styles/theme";
import { ThemeState } from "@/states";
import GnoswapThemeProvider from "@/common/layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <RecoilRoot>
          <GnoswapProvider>
            <Global styles={globalStyle} />
            <GnoswapThemeProvider>
              <Component {...pageProps} />
            </GnoswapThemeProvider>
          </GnoswapProvider>
        </RecoilRoot>
      </Hydrate>
    </QueryClientProvider>
  );
}
