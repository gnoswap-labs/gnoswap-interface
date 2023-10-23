import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapCardAutoRouter from "./SwapCardAutoRouter";

describe("SwapCard Component", () => {
  it("SwapCard render", () => {
    const mockProps = {
      swapRouteInfos: []
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardAutoRouter {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
