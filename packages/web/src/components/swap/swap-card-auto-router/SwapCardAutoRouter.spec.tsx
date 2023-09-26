import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapCardAutoRouter from "./SwapCardAutoRouter";
import {
  dummyAutoRouterInfo,
} from "@containers/swap-container/SwapContainer";

describe("SwapCard Component", () => {
  it("SwapCard render", () => {
    const mockProps = {
      autoRouterInfo: dummyAutoRouterInfo,
      from: {
        token: "USDCoin",
        symbol: "USDC",
        amount: "121",
        price: "$0.00",
        gnosExchangePrice: "1250",
        usdExchangePrice: "($1541.55)",
        balance: "0",
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
      to: {
        token: "HEX",
        symbol: "HEX",
        amount: "5000",
        price: "$0.00",
        gnosExchangePrice: "1250",
        usdExchangePrice: "($1541.55)",
        balance: "0",
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardAutoRouter {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
