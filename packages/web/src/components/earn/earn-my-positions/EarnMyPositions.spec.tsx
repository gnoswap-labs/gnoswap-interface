import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import EarnMyPositions, { EarnMyPositionsProps } from "./EarnMyPositions";

describe("EarnMyPositions Component", () => {
  it("EarnMyPositions render", () => {
    const args: EarnMyPositionsProps = {
      connected: true,
      fetched: true,
      positions: [],
      connect: () => { return; },
      moveEarnAdd: () => { return; },
      movePoolDetail: () => { return; },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <EarnMyPositions {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});