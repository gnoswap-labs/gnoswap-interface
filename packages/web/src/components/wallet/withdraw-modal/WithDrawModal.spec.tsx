import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import WithDrawModal from "./WithDrawModal";
import { DEVICE_TYPE } from "@styles/media";
import Notice from "@components/common/notice/NoticeToast";
import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("WithDrawModal Component", () => {
  it("WithDrawModal render", () => {
    const mockProps = {
      breakpoint: DEVICE_TYPE.WEB,
      withdrawInfo: {
        chainId: "dev",
        createdAt: "2023-10-10T08:48:46+09:00",
        name: "Gnoswap",
        address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
        path: "gno.land/r/gns",
        decimals: 4,
        symbol: "GNOT",
        logoURI:
          "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
        type: "grc20",
        priceId: "gno.land/r/gns",
      },
      fromToken: {
        chainId: "dev",
        createdAt: "2023-10-10T08:48:46+09:00",
        name: "Gnoswap",
        address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
        path: "gno.land/r/gns",
        decimals: 4,
        symbol: "GNOT",
        logoURI:
          "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
        type: "grc20",
        priceId: "gno.land/r/gns",
      },
      toToken: {
        chainId: "dev",
        createdAt: "2023-10-10T08:48:46+09:00",
        name: "Gnoswap",
        address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
        path: "gno.land/r/gns",
        decimals: 4,
        symbol: "GNOT",
        logoURI:
          "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
        type: "grc20",
        priceId: "gno.land/r/gns",
      },
      connected: true,
      changeToken: () => null,
      close: () => null,
    } as const;
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          refetchOnReconnect: false,
          refetchOnWindowFocus: false,
        },
      },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <GnoswapServiceProvider>
            <GnoswapThemeProvider>
              <Notice>
                <WithDrawModal {...mockProps} />
              </Notice>
            </GnoswapThemeProvider>
          </GnoswapServiceProvider>
        </JotaiProvider>
      </QueryClientProvider>
    );
  });
});
