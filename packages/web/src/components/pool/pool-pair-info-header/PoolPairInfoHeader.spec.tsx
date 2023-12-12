import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import PoolPairInfoHeader from "./PoolPairInfoHeader";
import { PoolRepositoryMock } from "@repositories/pool";

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

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <PoolPairInfoHeader {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
