import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context";

import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { PoolRepositoryMock } from "@repositories/pool";
import { createMockRouter } from "@test/createMockRouter";

import PoolPairInfoHeader from "./PoolPairInfoHeader";

const poolRepository = new PoolRepositoryMock();

describe("PoolPairInfoHeader Component", () => {
  it("PoolPairInfoHeader render", async () => {
    const pool = (await poolRepository.getPoolDetailByPoolPath());
    const mockProps = {
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      feeStr: "0.01%",
      incentivizedType: pool.incentiveType,
      rewardTokens: [],
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
            <GnoswapServiceProvider>
              <GnoswapThemeProvider>
                <PoolPairInfoHeader {...mockProps} />
              </GnoswapThemeProvider>
            </GnoswapServiceProvider>
          </JotaiProvider>
        </QueryClientProvider>
      </AppRouterContext.Provider>
    );
  });
});
