import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenAmount, { TokenAmountProps } from "./TokenAmount";

const token = {
  tokenId: "1",
  name: "Gnoland",
  symbol: "GNO.LAND",
  tokenLogo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
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