import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenAmount, { TokenAmountProps } from "./TokenAmount";

const token = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "GNOS",
  logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
  priceId: "gno.land/r/gnos"
};

describe("TokenAmount Component", () => {
  it("TokenAmount render", () => {
    const args: TokenAmountProps = {
      token,
      amount: "12,211",
      usdPrice: "",
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenAmount {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});