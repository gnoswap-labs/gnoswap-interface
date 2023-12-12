import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import PoolPairInfoContent from "./PoolPairInfoContent";
import { PoolRepositoryMock } from "@repositories/pool";

const poolRepository = new PoolRepositoryMock();

describe("PoolPairInfoContent Component", () => {
  it("PoolPairInfoContent render", async () => {
    const pool = (await poolRepository.getPoolDetailByPoolPath());
    const mockProps = {
      pool,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <PoolPairInfoContent {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
