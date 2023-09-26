import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenSwap, { TokenSwapProps } from "./TokenSwap";

describe("TokenSwap Component", () => {
  it("TokenSwap render", () => {
    const args: TokenSwapProps = {
      from: {
        token: {
          path: "USDCoin",
          name: "USDCoin",
          symbol: "USDC",
          logoURI:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        },
        amount: "121",
        price: "$0.00",
        balance: "0",
      },
      to: {
        token: {
          path: "HEX",
          name: "HEX",
          symbol: "HEX",
          logoURI:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
        },
        amount: "5000",
        price: "$0.00",
        balance: "0",
      },
      connected: true,
      connectWallet: () => { return; },
      swapNow: () => { return; },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <TokenSwap {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});