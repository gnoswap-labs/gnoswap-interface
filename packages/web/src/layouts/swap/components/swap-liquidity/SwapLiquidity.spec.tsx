import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import SwapLiquidity, { dummyLiquidityList } from "./SwapLiquidity";

const tokenA: TokenModel = {
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: "Foo",
  path: "gno.land/r/foo",
  tokenId: "gno.land/r/foo.FOO",
  decimals: 4,
  symbol: "FOO",
  displaySymbol: "FOO",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
  priceID: "gno.land/r/foo",
  address: "",
};
const tokenB: TokenModel = {
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: "Foo",
  path: "gno.land/r/foo",
  tokenId: "gno.land/r/foo.FOO",
  decimals: 4,
  symbol: "FOO",
  displaySymbol: "FOO",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
  priceID: "gno.land/r/foo",
  address: "",
};

describe("SwapLiquidity Component", () => {
  it("SwapLiquidity render", () => {
    const mockProps = {
      liquiditys: dummyLiquidityList,
      tokenA,
      tokenB,
      createPool: () => null,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapLiquidity {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
