import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import TokenInfoCell from "./TokenInfoCell";

const TOKEN = {
  path: "gno.land/r/football/world",
  name: "FOOTBALL WORLD CUB",
  symbol: "FWC",
  displaySymbol: "FWC",
  logoURI: "",
};

describe("TokenInfoCell", () => {
  it("truncates long names when requested", async () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenInfoCell token={TOKEN} isNative={false} truncateName />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(await screen.findByText("FOOTBALL...")).toBeInTheDocument();
    expect(screen.queryByText("FOOTBALL WORLD CUB")).not.toBeInTheDocument();
  });

  it("preserves the full name by default for shared consumers", async () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenInfoCell token={TOKEN} isNative={false} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(await screen.findByText("FOOTBALL WORLD CUB")).toBeInTheDocument();
    expect(screen.queryByText("FOOTBALL...")).not.toBeInTheDocument();
  });
});
