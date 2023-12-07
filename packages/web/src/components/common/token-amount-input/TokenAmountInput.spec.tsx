import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenAmountInput, { TokenAmountInputProps } from "./TokenAmountInput";

const token = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "GNOS",
  logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
  type: "grc20",
  priceId: "gno.land/r/gnos"
};

describe("TokenAmountInput Component", () => {
  it("TokenAmountInput render", () => {
    const args: TokenAmountInputProps = {
      token,
      amount: "12,211",
      balance: "12,211",
      usdValue: "12.3",
      changable: true,
      changeAmount: () => { return; },
      changeToken: () => { return; },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenAmountInput {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});