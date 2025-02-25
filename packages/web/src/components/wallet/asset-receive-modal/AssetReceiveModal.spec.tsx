import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context";

import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";
import { createMockRouter } from "@test/createMockRouter";

import AssetReceiveModal, { DEFAULT_DEPOSIT_GNOT } from "./AssetReceiveModal";
import SocialWalletProvider from "@providers/social-wallet-provider";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

describe("AssetReceiveModal Component", () => {
  it("AssetReceiveModal render", () => {
    const mockProps = {
      breakpoint: DEVICE_TYPE.WEB,
      depositInfo: DEFAULT_DEPOSIT_GNOT,
      avgBlockTime: 2.2,
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
      <AppRouterContext.Provider value={createMockRouter({})}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <GnoswapThemeProvider>
              <GnoswapServiceProvider>
                <SocialWalletProvider>
                  <AssetReceiveModal {...mockProps} />
                </SocialWalletProvider>
              </GnoswapServiceProvider>
            </GnoswapThemeProvider>
          </JotaiProvider>
          ,
        </QueryClientProvider>
      </AppRouterContext.Provider>,
    );
  });
});
