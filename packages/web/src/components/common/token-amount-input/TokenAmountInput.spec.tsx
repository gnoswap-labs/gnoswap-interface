import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenAmountInput, { TokenAmountInputProps } from "./TokenAmountInput";
import { TokenModel } from "@models/token/token-model";

const token: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  decimals: 4,
  symbol: "GNS",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  type: "grc20",
  priceId: "gno.land/r/gns"
};

describe("TokenAmountInput Component", () => {
  it("TokenAmountInput render", () => {
    const args: TokenAmountInputProps = {
      token,
      connected: true,
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