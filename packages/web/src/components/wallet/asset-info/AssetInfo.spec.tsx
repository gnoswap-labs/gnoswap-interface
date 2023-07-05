import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import AssetInfo from "./AssetInfo";

describe("AssetInfo Component", () => {
  it("AssetInfo render", () => {
    const mockProps = {
      asset: {
        id: "BTC",
        logoUri:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        type: "NATIVE" as "GRC20" | "NATIVE",
        name: "Bitcoin",
        symbol: "BTC",
        chain: "Gnoland",
        balance: "0.000000",
      },
      deposit: () => null,
      withdraw: () => null,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <AssetInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
