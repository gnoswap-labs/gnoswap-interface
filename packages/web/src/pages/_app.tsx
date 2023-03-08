import { useState } from "react";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { GnoswapProvider } from "@/common/providers";
import { Global, ThemeProvider } from "@emotion/react";
import globalStyle from "@/styles/globalStyle";
import theme from "@/styles/theme";

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
            <ThemeProvider theme={theme}>
              <Global styles={globalStyle} />
              <Component {...pageProps} />
            </ThemeProvider>
          </GnoswapProvider>
        </RecoilRoot>
      </Hydrate>
    </QueryClientProvider>
  );
}
