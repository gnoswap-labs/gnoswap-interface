import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapCard from "./SwapCard";
import {
  coinList,
  tokenInfo,
  dummyAutoRouterInfo,
  dummySwapGasInfo,
} from "@containers/swap-container/SwapContainer";
import { DEVICE_TYPE } from "@styles/media";

describe("SwapCard Component", () => {
  it("SwapCard render", () => {
    const mockProps = {
      search: () => null,
      keyword: "",
      gnosAmount: "1",
      isConnected: true,
      autoRouter: false,
      showAutoRouter: () => null,
      swapGasInfo: dummySwapGasInfo,
      swapInfo: true,
      showSwapInfo: () => null,
      autoRouterInfo: dummyAutoRouterInfo,
      settingMenuToggle: true,
      onSettingMenu: () => null,
      tolerance: "",
      changeTolerance: () => null,
      tokenModal: true,
      onSelectTokenModal: () => null,
      swapOpen: true,
      onConfirmModal: () => null,
      coinList: coinList(),
      changeToken: () => null,
      selectToken: () => null,
      submitSwap: () => null,
      resetTolerance: () => null,
      breakpoint: DEVICE_TYPE.WEB,
      submit: false,
      isFetched: true,
      swapResult: { success: true, transaction: "https//:naver.com" },
      from: {
        token: "USDCoin",
        symbol: "USDC",
        amount: "121",
        price: "$0.00",
        gnosExchangePrice: "1250",
        usdExchangePrice: "($1541.55)",
        balance: "0",
        tokenLogo:
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
        tokenLogo:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCard {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
