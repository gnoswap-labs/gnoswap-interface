import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import PoolPairInfoHeader from "./PoolPairInfoHeader";
import { PoolRepositoryMock } from "@repositories/pool";
import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const poolRepository = new PoolRepositoryMock();

describe("PoolPairInfoHeader Component", () => {
  it("PoolPairInfoHeader render", async () => {
    const pool = (await poolRepository.getPoolDetailByPoolPath());
    const mockProps = {
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      feeStr: "0.01%",
      incentivizedType: pool.incentivizedType,
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
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <GnoswapServiceProvider>
            <GnoswapThemeProvider>
              <PoolPairInfoHeader {...mockProps} />
            </GnoswapThemeProvider>
          </GnoswapServiceProvider>
        </JotaiProvider>
      </QueryClientProvider>,
    );
  });
});
