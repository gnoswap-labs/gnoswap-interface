import { useState } from "react";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { GlobalLayout } from "@/components/core/layout";
import { ErrorBoundary } from "@/components/core/error-boundary";
import { GlobalStyle } from "@/common/styles";
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
				<GnoswapProvider>
					<RecoilRoot>
						<GlobalStyle />
						<ErrorBoundary fallback={<div>ERROR</div>}>
							<GlobalLayout>
								<Component {...pageProps} />
							</GlobalLayout>
						</ErrorBoundary>
					</RecoilRoot>
				</GnoswapProvider>
			</Hydrate>
		</QueryClientProvider>
	);
}
