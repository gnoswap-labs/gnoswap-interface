import { useState } from "react";
import type { AppProps } from "next/app";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { GnoswapProvider } from "@/common/providers";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { Provider as JotaiProvider } from "jotai";

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
        <JotaiProvider>
          <GnoswapProvider>
            <GnoswapThemeProvider>
              <Component {...pageProps} />
            </GnoswapThemeProvider>
          </GnoswapProvider>
        </JotaiProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
