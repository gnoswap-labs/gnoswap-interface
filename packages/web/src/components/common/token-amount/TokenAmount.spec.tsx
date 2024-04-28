import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenAmount, { TokenAmountProps } from "./TokenAmount";
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
  priceID: "gno.land/r/gns"
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