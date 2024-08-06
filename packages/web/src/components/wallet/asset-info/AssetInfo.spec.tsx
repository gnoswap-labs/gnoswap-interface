import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import AssetInfo, { AssetInfoProps } from "./AssetInfo";
import { DEVICE_TYPE } from "@styles/media";

describe("AssetInfo Component", () => {
  it("AssetInfo render", () => {
    const mockProps: AssetInfoProps = {
      asset: {
        path: "gno.land/r/onbloc/gns",
        type: "grc20",
        chainId: "Gnoland",
        name: "Gnoswap",
        symbol: "GNS",
        decimals: 6,
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        balance: "0.000000",
        priceID: "gno.land/r/onbloc/gns",
        createdAt : ""
      },
      deposit: () => null,
      withdraw: () => null,
      moveTokenPage: () => null,
      breakpoint: DEVICE_TYPE.WEB,
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
