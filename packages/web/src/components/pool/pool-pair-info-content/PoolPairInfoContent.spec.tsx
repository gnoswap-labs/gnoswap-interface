import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import PoolPairInfoContent from "./PoolPairInfoContent";
import { poolPairInit } from "@containers/pool-pair-information-container/PoolPairInformationContainer";

describe("PoolPairInfoContent Component", () => {
  it("PoolPairInfoContent render", () => {
    const mockProps = {
      content: poolPairInit,
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
