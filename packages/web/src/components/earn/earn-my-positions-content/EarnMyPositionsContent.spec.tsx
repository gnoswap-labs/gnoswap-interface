import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import EarnMyPositionsContent, { EarnMyPositionContentProps } from "./EarnMyPositionsContent";

describe("EarnMyPositionsContent Component", () => {
  it("EarnMyPositionsContent render", () => {
    const args: EarnMyPositionContentProps = {
      connected: false,
      fetched: true,
      positions: [],
      connect: () => { return; },
      movePoolDetail: () => { return; },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <EarnMyPositionsContent {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});