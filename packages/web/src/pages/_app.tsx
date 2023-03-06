import { useState } from "react";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { GnoswapProvider } from "@/common/providers";

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
            <Component {...pageProps} />
          </GnoswapProvider>
        </RecoilRoot>
      </Hydrate>
    </QueryClientProvider>
  );
}
