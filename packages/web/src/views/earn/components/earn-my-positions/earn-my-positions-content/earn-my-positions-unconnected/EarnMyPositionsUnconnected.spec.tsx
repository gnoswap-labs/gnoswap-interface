import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import EarnMyPositionsUnconnected, { EarnMyPositionsUnconnectedProps } from "./EarnMyPositionsUnconnected";

describe("EarnMyPositionsUnconnected Component", () => {
  it("EarnMyPositionsUnconnected render", () => {
    const args: EarnMyPositionsUnconnectedProps = {
      connect: () => { return; }
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <EarnMyPositionsUnconnected {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});