import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapLiquidity from "./SwapLiquidity";
import { dummyLiquidityList } from "@containers/swap-liquidity-container/SwapLiquidityContainer";
import { TokenModel } from "@models/token/token-model";

const tokenA: TokenModel = {
  chainId: "test3",
  address: "0x111111111117dC0aa78b770fA6A738034120C302",
  path: "gno.land/r/demo/1inch",
  name: "1inch",
  symbol: "1INCH",
  decimals: 6,
  logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
  type: "grc20",
  priceId: "1inch",
  createdAt: "1999-01-01T00:00:01Z"
};
const tokenB: TokenModel = {
  name: "Wrapped Ether",
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  path: "gno.land/r/demo/weth",
  symbol: "WETH",
  decimals: 6,
  chainId: "test3",
  type: "grc20",
  priceId: "weth",
  createdAt: "1999-01-01T00:00:02Z",
  isWrappedGasToken: true,
  logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png"
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
