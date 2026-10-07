import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";
import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import AssetInfo, { AssetInfoProps } from "./AssetInfo";

jest.mock("next/router", () => ({
  useRouter: () => ({
    prefetch: jest.fn(() => Promise.resolve()),
    push: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(() => Promise.resolve(true)),
    pathname: "/test",
    query: {},
    asPath: "/test",
    isReady: true,
  }),
}));

describe("AssetInfo Component", () => {
  it("AssetInfo render", async () => {
    const mockProps: AssetInfoProps = {
      asset: {
        path: "gno.land/r/onbloc/gns",
        type: "GRC20",
        chainId: "Gnoland",
        name: "FOOTBALL WORLD CUB",
        symbol: "GNS",
        displaySymbol: "GNS",
        decimals: 6,
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        balance: "0.000000",
        priceID: "gno.land/r/onbloc/gns",
        createdAt: "",
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

    expect(await screen.findByText("FOOTBALL...")).toBeInTheDocument();
    expect(screen.queryByText("FOOTBALL WORLD CUB")).not.toBeInTheDocument();
  });
});
