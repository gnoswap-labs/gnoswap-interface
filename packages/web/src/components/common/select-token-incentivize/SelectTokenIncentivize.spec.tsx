import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { TokenModel } from "@models/token/token-model";
import SelectToken, { SelectTokenIncentivizeProps } from "./SelectTokenIncentivize";

describe("SelectToken Component", () => {
  it("SelectToken render", () => {
    const args: SelectTokenIncentivizeProps = {
      keyword: "",
      defaultTokens: [],
      tokens: [],
      tokenPrices: {},
      changeKeyword: () => {
        return;
      },
      changeToken: () => {
        return;
      },
      close: () => {
        return;
      },
      themeKey: "dark",
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SelectToken {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });

  it("truncates long token names in the token list", async () => {
    const token: TokenModel = {
      path: "gno.land/r/football/world",
      type: "GRC20",
      chainId: "Gnoland",
      name: "FOOTBALL WORLD CUB",
      symbol: "FWC",
      displaySymbol: "FWC",
      decimals: 6,
      logoURI: "",
      createdAt: "",
      priceID: "gno.land/r/football/world",
    };

    const args: SelectTokenIncentivizeProps = {
      keyword: "",
      defaultTokens: [],
      tokens: [token],
      tokenPrices: {},
      changeKeyword: jest.fn(),
      changeToken: jest.fn(),
      close: jest.fn(),
      themeKey: "dark",
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SelectToken {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(await screen.findByText("FOOTBALL...")).toBeInTheDocument();
    expect(screen.queryByText("FOOTBALL WORLD CUB")).not.toBeInTheDocument();
  });
});
