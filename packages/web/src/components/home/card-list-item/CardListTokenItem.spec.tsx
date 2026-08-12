import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { CardListTokenInfo } from "@models/common/card-list-item-info";

import CardListTokenItem from "./CardListTokenItem";

const TOKEN_ITEM: CardListTokenInfo = {
  token: {
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
  },
  upDown: "none",
  content: "-",
};

describe("CardListTokenItem", () => {
  it("truncates long token names in the home card list", async () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <CardListTokenItem index={1} item={TOKEN_ITEM} onClickItem={jest.fn()} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(await screen.findByText("FOOTBALL...")).toBeInTheDocument();
    expect(screen.queryByText("FOOTBALL WORLD CUB")).not.toBeInTheDocument();
  });
});
