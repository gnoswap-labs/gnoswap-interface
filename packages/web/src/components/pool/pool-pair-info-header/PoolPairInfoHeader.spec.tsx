import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import PoolPairInfoHeader from "./PoolPairInfoHeader";
import { poolPairInit } from "@containers/pool-pair-information-container/PoolPairInformationContainer";

describe("PoolPairInfoHeader Component", () => {
  it("PoolPairInfoHeader render", () => {
    const mockProps = {
      info: poolPairInit.poolInfo,
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
