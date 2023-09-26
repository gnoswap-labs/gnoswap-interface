import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenAmountInput, { TokenAmountInputProps } from "./TokenAmountInput";

const token = {
  path: "1",
  name: "Gnoland",
  symbol: "GNO.LAND",
  logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
};

describe("TokenAmountInput Component", () => {
  it("TokenAmountInput render", () => {
    const args: TokenAmountInputProps = {
      token,
      amount: "12,211",
      balance: "12,211",
      usdValue: "12.3",
      changable: true,
      changeBalance: () => { return; },
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