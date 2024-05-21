import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import DepositModal, { DEFAULT_DEPOSIT_GNOT } from "./DepositModal";
import { DEVICE_TYPE } from "@styles/media";
import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("DepositModal Component", () => {
  it("DepositModal render", () => {
    const mockProps = {
      breakpoint: DEVICE_TYPE.WEB,
      depositInfo: DEFAULT_DEPOSIT_GNOT,
      changeToken: () => null,
      close: () => null,
      callback: () => null,
    };

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
          <GnoswapThemeProvider>
            <GnoswapServiceProvider>
              <DepositModal {...mockProps} />
            </GnoswapServiceProvider>
          </GnoswapThemeProvider>
        </JotaiProvider>,
      </QueryClientProvider>
    );
  });
});
