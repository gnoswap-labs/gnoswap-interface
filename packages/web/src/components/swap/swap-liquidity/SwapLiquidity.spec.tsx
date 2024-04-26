import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapLiquidity from "./SwapLiquidity";
import { dummyLiquidityList } from "@containers/swap-liquidity-container/SwapLiquidityContainer";
import { TokenModel } from "@models/token/token-model";

const tokenA: TokenModel = {
  type: "grc20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: "Foo",
  path: "gno.land/r/foo",
  decimals: 4,
  symbol: "FOO",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
  priceID: "gno.land/r/foo",
  address: ""
};
const tokenB: TokenModel = {
  type: "grc20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: "Foo",
  path: "gno.land/r/foo",
  decimals: 4,
  symbol: "FOO",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
  priceID: "gno.land/r/foo",
  address: ""
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
